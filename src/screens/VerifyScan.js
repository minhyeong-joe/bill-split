import React, { Component } from "react";
import { View, Text, Modal, TextInput } from "react-native";

import { commonStyles } from "../CommonStyles";
import ListItem from "../components/ListItem";
import CustomButton from "../components/CustomButton";
import InputGroup from "../components/InputGroup";

import { OCR_API_KEY } from "../../Config";

export default class VerifyScan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      onEdit: false,
      onAdd: false,
      modalText: "",
      modalPrice: "",
      modalId: -1,
      nextId: null,
      items: [],
      subtotal: null,
      tax: null,
      total: null,
    };
  }

  componentDidMount = async () => {
    const { image } = this.props.route.params;

    let imageFile = {
      uri: image.uri,
      type: "image/jpg",
      name: "receipt_scan.jpg",
    };
    let formData = new FormData();
    formData.append("file", imageFile);
    formData.append("isTable", true);
    formData.append("scale", true);
    formData.append("isOverlayRequired", false);
    await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        apikey: OCR_API_KEY,
      },
      body: formData,
    })
      .then(response => response.json())
      .then(res => {
        console.log(res.ParsedResults[0].ParsedText);

        const parsed = this.parseReceipt(res.ParsedResults[0].ParsedText);
        this.setState({
          loading: false,
          items: parsed.items,
          subtotal: parsed.subtotal,
          tax: parsed.tax,
          total: parsed.total,
          nextId: parsed.items.length,
        });
      })
      .catch(err => {
        console.error(err);
      });

    // FOR DEBUG & TEST without using API
    // setTimeout(() => {
    //   this.setState({
    //     loading: false,
    //     items: [
    //       { id: 0, item: "Item 1", price: 5.12 },
    //       { id: 1, item: "Item 2", price: 3.85 },
    //     ],
    //     subtotal: 8.97,
    //     tax: 0.7,
    //     total: 9.67,
    //     nextId: 2,
    //   });
    // }, 200);
  };

  parseReceipt = raw => {
    let lines = raw.split("\n");
    let items = [];
    const priceRegex = /[0-9]+\s{0,1}[\.\,\s]\s{0,1}[0-9]{2}/;
    const itemPriceRegex = /.+\s+[0-9]+\s{0,1}[\.\,\s]\s{0,1}[0-9]{2}/;
    // OCR API sometimes reads subtotal as "subtota I" depends on pic quality/font. Using regex to capture as many cases.
    const subtotalRegex = /(sub\s{0,1}tota|sub-tota)\s{0,2}[il1]\s+\${0,1}\s+[0-9]+\s{0,1}[\.\,\s]\s{0,1}[0-9]{2}/i;
    const taxRegex = /tax\s+\${0,1}\s+[0-9]+\s{0,1}[\.\,\s]\s{0,1}[0-9]{2}/i;
    const totalRegex = /(tota)\s{0,1}[il1]\s+\${0,1}\s+[0-9]+\s{0,1}[\.\,\s]\s{0,1}[0-9]{2}/i;
    // for each line,
    // if it is item, price pair, add it into item object - items: [{id, item, price} ...]
    // if it is is subtotal, tax, or total - set corresponding variable
    let subtotal, tax, total;
    let id = 0;
    let isItem = true;
    for (let line of lines) {
      if (
        subtotalRegex.test(line) ||
        taxRegex.test(line) ||
        totalRegex.test(line)
      ) {
        // read subtotal, tax, or total, then anything below are not items
        isItem = false;
        if (subtotalRegex.test(line)) {
          subtotal = line.match(priceRegex)[0];
          subtotal = subtotal.replace(",", ".", 1);
          subtotal = subtotal.replace(" ", "", -1);
          subtotal = parseFloat(subtotal);
        } else if (taxRegex.test(line)) {
          tax = line.match(priceRegex)[0];
          tax = tax.replace(",", ".", 1);
          tax = tax.replace(" ", "", -1);
          tax = parseFloat(tax);
        } else if (totalRegex.test(line)) {
          total = line.match(priceRegex)[0];
          total = total.replace(",", ".", 1);
          total = total.replace(" ", "", -1);
          total = parseFloat(total);
        }
      } else if (itemPriceRegex.test(line) && isItem) {
        let raw = line.trim();
        let price = raw.match(priceRegex)[0];
        let itemName = raw.slice(0, raw.indexOf(price)).trim();
        price = price.replace(",", ".", 1);
        price = price.replace(" ", "", -1);
        price = parseFloat(price);
        items.push({
          id: id,
          item: itemName,
          price: price,
        });
        id++;
      }
    }
    console.log("Items", items);
    console.log("subtotal", subtotal);
    console.log("tax", tax);
    console.log("total", total);
    return {
      items: items,
      subtotal: subtotal,
      tax: tax,
      total: total,
    };
  };

  onClickDelete = id => {
    let items = [...this.state.items];
    items = items.filter(item => item.id != id);
    this.setState({
      items: items,
    });
  };

  onClickEdit = id => {
    // tax edit
    if (id == -1) {
      this.setState({
        onEdit: true,
        modalText: "Tax",
        modalPrice: this.state.tax ? this.state.tax.toFixed(2) : "0.00",
        modalId: -1,
      });
      return;
    }
    let item = this.state.items.find(item => item.id == id);
    this.setState({
      onEdit: true,
      modalText: item.item,
      modalPrice: item.price.toFixed(2),
      modalId: item.id,
    });
  };

  onClickAdd = () => {
    this.setState({
      onAdd: true,
      modalId: this.state.nextId,
      modalText: "",
      modalPrice: "",
    });
  };

  onChangeModalText = text => {
    this.setState({
      modalText: text,
    });
  };

  onChangeModalPrice = price => {
    this.setState({
      modalPrice: price,
    });
  };

  onClickConfirm = () => {
    // edit
    if (this.state.onEdit) {
      // tax edit
      if (this.state.modalId === -1) {
        this.setState({
          tax: parseFloat(parseFloat(this.state.modalPrice).toFixed(2)),
        });
      } else {
        let items = [...this.state.items];
        let item = items.find(item => item.id == this.state.modalId);
        item.item = this.state.modalText;
        item.price = parseFloat(parseFloat(this.state.modalPrice).toFixed(2));
        this.setState({
          items: items,
        });
      }
    }
    // add
    else if (this.state.onAdd) {
      let item = {
        id: this.state.modalId,
        item: this.state.modalText,
        price: parseFloat(parseFloat(this.state.modalPrice).toFixed(2)),
      };
      this.setState(prevState => ({
        items: [...prevState.items, item],
        nextId: prevState.nextId + 1,
      }));
    }
    this.setState({
      onEdit: false,
      onAdd: false,
    });
  };

  onClickNext = () => {
    let subtotal = this.state.items.reduce((sum, item) => {
      return sum + item.price;
    }, 0);
    console.log(subtotal);
    let taxPercent = parseFloat(((this.state.tax / subtotal) * 100).toFixed(2));
    console.log(taxPercent);

    this.props.navigation.navigate("SplitOption", {
      items: this.state.items,
      taxPercent: taxPercent,
    });
  };

  render() {
    const {
      loading,
      onEdit,
      onAdd,
      modalText,
      modalPrice,
      modalId,
      items,
      tax,
    } = this.state;

    if (loading) {
      return (
        <View style={commonStyles.fullCenterContainer}>
          <Text>Processing Receipt...</Text>
        </View>
      );
    }

    return (
      <View style={commonStyles.container}>
        <Text style={{ fontSize: 18, textAlign: "center" }}>
          Please verify following information:
        </Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: "center",
            color: "lightslategray",
            marginBottom: 8,
          }}
        >
          Edit or Delete as needed
        </Text>
        {items.map(item => (
          <ListItem
            key={item.id}
            item={item.item}
            price={item.price}
            onClickDelete={() => this.onClickDelete(item.id)}
            onClickEdit={() => this.onClickEdit(item.id)}
            style={{ width: "90%" }}
          />
        ))}
        <ListItem
          key="tax"
          item="Tax"
          price={tax ? tax : 0}
          onClickEdit={() => this.onClickEdit(-1)}
          style={{ marginTop: 10, width: "90%" }}
          itemStyle={{ fontWeight: "bold", fontSize: 20 }}
        />
        <CustomButton
          text="Add item"
          onPress={() => this.onClickAdd()}
          style={{ width: "50%", marginTop: 10 }}
          btnStyle={{ backgroundColor: "forestgreen" }}
          textStyle={{ color: "white" }}
        />
        <CustomButton
          text="Next >>"
          onPress={() => this.onClickNext()}
          style={{ marginBottom: 0, marginTop: "auto" }}
          btnStyle={{ borderRadius: 0 }}
        />

        <Modal
          animationType="fade"
          transparent={true}
          visible={onEdit || onAdd}
          onShow={() => {
            modalId >= 0 ? this.itemInput.focus() : this.priceInput.focus();
          }}
        >
          <View style={commonStyles.fullCenterContainer}>
            <View
              style={[
                commonStyles.container,
                {
                  maxHeight: 150,
                  width: "85%",
                  backgroundColor: "rgba(255,255,255,0.9)",
                },
              ]}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "bold", marginVertical: 10 }}
              >
                {onEdit ? "Edit" : "Add"}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <TextInput
                  ref={input => {
                    this.itemInput = input;
                  }}
                  onChangeText={text => this.onChangeModalText(text)}
                  value={modalText}
                  style={[commonStyles.input, { flex: 1.5 }]}
                  editable={modalId >= 0}
                  placeholder="Item Name"
                  returnKeyType="next"
                  onSubmitEditing={() => this.priceInput.focus()}
                  blurOnSubmit={false}
                  underlineColorAndroid="#999"
                />
                <TextInput
                  ref={input => {
                    this.priceInput = input;
                  }}
                  onChangeText={price => this.onChangeModalPrice(price)}
                  value={modalPrice}
                  style={[commonStyles.input, { flex: 1 }]}
                  keyboardType="numeric"
                  placeholder="Price"
                  returnKeyType={"done"}
                  onSubmitEditing={() => this.onClickConfirm()}
                  underlineColorAndroid="#999"
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  marginTop: 10,
                }}
              >
                <CustomButton
                  text="Cancel"
                  style={{ width: "30%", marginLeft: 8 }}
                  btnStyle={{ backgroundColor: "gray", paddingVertical: 5 }}
                  onPress={() => {
                    this.setState({ onEdit: false, onAdd: false });
                  }}
                />
                <CustomButton
                  text="Confirm"
                  onPress={() => this.onClickConfirm()}
                  style={{ width: "30%", marginRight: 8 }}
                  btnStyle={{
                    backgroundColor: "forestgreen",
                    paddingVertical: 5,
                  }}
                  textStyle={{ color: "white" }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

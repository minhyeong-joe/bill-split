import React, { Component } from "react";
import { View, Text, Alert } from "react-native";

import { commonStyles } from "../CommonStyles";
import ListItem from "../components/ListItem";
import CustomButton from "../components/CustomButton";

export default class VerifyScan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      items: [],
      subtotal: null,
      tax: null,
      total: null,
    };
  }

  componentDidMount = () => {
    // const { image } = this.props.route.params;

    // let imageFile = {
    //   uri: image.uri,
    //   type: "image/jpg",
    //   name: "receipt_scan.jpg",
    // };
    // let formData = new FormData();
    // formData.append("file", imageFile);
    // formData.append("isTable", true);
    // formData.append("scale", true);
    // formData.append("isOverlayRequired", false);
    // await fetch("https://api.ocr.space/parse/image", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //     apikey: OCR_API_KEY,
    //   },
    //   body: formData,
    // })
    //   .then(response => response.json())
    //   .then(res => {
    //     const parsed = this.parseReceipt(res.ParsedResults[0].ParsedText);
    //     this.setState({
    //       loading: false,
    //       items: parsed.items,
    //       subtotal: parsed.subtotal,
    //       tax: parsed.tax,
    //       total: parsed.total,
    //     });
    //   })
    //   .catch(err => {
    //     console.error(err);
    //   });

    setTimeout(() => {
      this.setState({
        loading: false,
        items: [
          { id: 0, item: "Item 1", price: 5.12 },
          { id: 1, item: "Item 2", price: 3.85 },
        ],
        subtotal: 8.97,
        tax: 0.7,
        total: 9.67,
      });
    }, 200);
  };

  parseReceipt = raw => {
    let lines = raw.split("\n");
    let items = [];
    const priceRegex = /[0-9]+\s{0,1}[\.\,\s]\s{0,1}[0-9]{2}/;
    const itemPriceRegex = /.+\s+[0-9]+\s{0,1}[\.\,\s]\s{0,1}[0-9]{2}/;
    // OCR API sometimes reads subtotal as "subtota I" depends on pic quality/font. Using regex to capture as many cases.
    const subtotalRegex = /(sub\s{0,1}tota|sub-tota)\s{0,2}[il1]\s+[0-9]+\s{0,1}[\.\,\s]\s{0,1}[0-9]{2}/i;
    const taxRegex = /tax\s+[0-9]+\s{0,1}[\.\,\s]\s{0,1}[0-9]{2}/i;
    const totalRegex = /(tota)\s{0,1}[il1]\s+[0-9]+\s{0,1}[\.\,\s]\s{0,1}[0-9]{2}/i;
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
        price.replace(",", ".", 1);
        price.replace(" ", "", -1);
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
      Alert.alert("Dev", "Modifying Tax");
      return;
    }
    let items = [...this.state.items];
    let item = items.find(item => item.id == id);
    Alert.alert(
      "Dev",
      `id: ${item.id}\nItem: ${item.item}\nPrice: ${item.price.toFixed(2)}`
    );
  };

  render() {
    const { loading, items, tax } = this.state;

    if (loading) {
      return (
        <View style={commonStyles.fullCenterContainer}>
          <Text>Processing Receipt...</Text>
        </View>
      );
    }

    return (
      <View style={commonStyles.container}>
        <Text style={{ textAlign: "center" }}>
          Please verify following information:
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
          onPress={() => {}}
          style={{ width: "50%", marginTop: 10 }}
          btnStyle={{ backgroundColor: "forestgreen" }}
          textStyle={{ color: "white" }}
        />
        <CustomButton
          text="Next >>"
          onPress={() => {}}
          style={{ marginBottom: 0, marginTop: "auto" }}
          btnStyle={{ borderRadius: 0 }}
        />
      </View>
    );
  }
}

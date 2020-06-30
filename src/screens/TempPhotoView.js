import React from 'react';
import { View, ScrollView, Text, Image } from 'react-native';

import { commonStyles } from '../CommonStyles';

export default function TempPhotoView({route}) {

    const { image, text } = route.params;

    console.log(image);
    
    console.log(text.ParsedResults[0].ParsedText);

    parseReceipt(text.ParsedResults[0].ParsedText);
    
    
    return (
        <View style={commonStyles.container}>
            <ScrollView contentContainerStyle={{flexGrow: 1}} style={{width: '80%'}}>

                <Text style={{textAlign: 'center'}}>Image Preview</Text>
                <Text style={{textAlign: 'center'}}>Temporary Page for Camera Test</Text>

                <Image 
                    source={{uri: image.uri}}
                    style={{flex: 10, height: '100%', width:'100%', resizeMode:'contain'}}
                />
                <Text style={{flex: 1}}>{text.ParsedResults[0].ParsedText}</Text>

            </ScrollView>
        </View>
    );
}

const parseReceipt = (raw) => {
    let lines = raw.split('\n');
    let items = [];
    const priceRegex = /[0-9]+\s{0,1}[\.\,\s]\s{0,1}[0-9]{2}/;
    const itemPriceRegex = /.+\s+[0-9]+\s{0,1}[\.\,\s]\s{0,1}[0-9]{2}/;
    // OCR API sometimes reads subtotal as "subtota I" depends on pic quality/font. Using regex to capture as many cases.
    const subtotalRegex = /(sub\s{0,1}tota|sub-tota)\s{0,2}[il]\s+[0-9]+\s{0,1}[\.\,\s]\s{0,1}[0-9]{2}/i;
    const taxRegex = /tax\s+[0-9]+\s{0,1}[\.\,\s]\s{0,1}[0-9]{2}/i;
    const totalRegex = /(tota)\s{0,1}[il]\s+[0-9]+\s{0,1}[\.\,\s]\s{0,1}[0-9]{2}/i;
    // for each line, 
    // if it is item, price pair, add it into item object - items: [{id, item, price} ...]
    // if it is is subtotal, tax, or total - set corresponding variable
    let subtotal, tax, total;
    let id = 0;
    let isItem = true;
    for (let line of lines) {
        if (subtotalRegex.test(line) || taxRegex.test(line) || totalRegex.test(line)) {
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
        }
        else if (itemPriceRegex.test(line) && isItem) {
            let raw = line.trim();
            let price = raw.match(priceRegex)[0];
            let itemName = raw.slice(0, raw.indexOf(price)).trim();
            price.replace(",", ".", 1);
            price.replace(" ", "", -1);
            price = parseFloat(price);
            items.push({
                id: id,
                item: itemName,
                price: price 
            });
            id++;
        }
    }
    console.log("Items", items);
    console.log("subtotal", subtotal);
    console.log("tax", tax);
    console.log("total", total);
   
};
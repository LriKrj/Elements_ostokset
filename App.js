
import { StyleSheet, FlatList, SafeAreaView} from "react-native";
import * as SQLite from "expo-sqlite";
import { useEffect } from "react";
import { useState } from "react";
import { Header } from'react-native-elements';

import { Input, Button, ListItem, Icon } from'react-native-elements';

const db = SQLite.openDatabase("shoppingdb.db");

export default function App() {
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [shoppinglist, setShoppinglist] = useState([]);

  useEffect(() => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "create table if not exists shopping (id integer primary key not null, product text, amount text);"
        );
      },
      null,
      updateList
    );
  }, []);

  const saveProduct = () => {
    db.transaction(
      (tx) => {
        tx.executeSql("insert into shopping (product, amount) values (?, ?);", [
          product,
          amount,
        ]);
      },
      null,
      updateList
    );
  };

  const updateList = () => {
    db.transaction((tx) => {
      tx.executeSql("select * from shopping;", [], (_, { rows }) =>
        setShoppinglist(rows._array)
      );
    });
  };

  const deleteProduct = (id) => {
    db.transaction(
      (tx) => {
        tx.executeSql(`delete from shopping where id = ?;`, [id]);
      },
      null,
      updateList
    );
  };
  const renderItem = ({item}) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.product}</ListItem.Title>
        <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
      </ListItem.Content>
      <Icon type='material' name='delete' color='red' onPress={() => deleteProduct(item.id)} />
    </ListItem>
    )
  

  return (
    <SafeAreaView style={styles.container}>
      <Header centerComponent={{ text: 'SHOPPING LIST', style: { color: '#fff' } }}/>
      <Input placeholder='Product'label='PRODUCT'onChangeText={product => setProduct(product)} value={product} style={{marginTop: 5}}/>
      <Input placeholder='Amount'label='AMOUNT'onChangeText={amount => setAmount(amount)} value={amount} style={{marginTop: 5}}/>
      <Button raised icon={{name: 'save'}} onPress={saveProduct}title="SAVE"  />
     
      <FlatList   
        style={{padding: 0, width:"100%"}}
        data={shoppinglist}
        renderItem={renderItem}  
        keyExtractor={(item, index) => index.toString()}
        
      /> 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
   },
});

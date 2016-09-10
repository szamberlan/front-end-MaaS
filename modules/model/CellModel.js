/*jshint esversion: 6 */
/*
* Name : CellModel.js
* Location : ./modules/model/
*
* History :
*
* Version         Date           Programmer
* =================================================
* 0.1.0           2016-08-15     Zamberlan Sebastiano
* —---------------------------------------------—
* Codifica modulo e Inserimento degli errori
* =================================================
* 0.2.0           2016-09-08     Roberto D'Amico
* —---------------------------------------------—
* Inserimento del metodo Render
* =================================================
*/
import AttributeReader from '../utils/AttributeReader'
import
{
  executeQuery
}
from '../utils/DSLICompiler'
import * as actions from '../actions/RootAction'
import CellVisualize from './CellVisualize'
import MaasError from '../utils/MaasError'
import React from 'react'

class CellModel
{
  constructor(params)
  {
    this.flag = true;
    this.show = false;
    this.storageResult = [];
    this.JSON;
    this.label = undefined;
    var self = this;

    //Lettura Attributi Obbligatori
    AttributeReader.readRequiredAttributes(params, this, [
      "label", "type", "value"
    ], function(param)
    {
      throw new MaasError(8000,
        "Required parameter '" + param + "' in cell '" + self
        .toString() + "'");
    });

    //Lettura Attributi con valore vuoto
    AttributeReader.assertEmptyAttributes(params, function(param)
    {
      throw new MaasError(8000,
        "Unexpected parameter '" + param + "' in cell '" +
        self.toString() + "'");
    });

    if (typeof this.value == "object")
    {
      //Lettura Attributi Obbligatori
      AttributeReader.readRequiredAttributes(this.value, this, [
        "collection", "select"
      ], function(param)
      {
        throw new MaasError(8000,
          "Required parameter '" + param +
          "' in cell.value '" + self.toString() + "'");
      });

      this.sortby = "{'_id': 1}";
      this.order = "asc";
      this.count = false;

      //Lettura Attributi Opzionali
      AttributeReader.readOptionalAttributes(this.value, this, [
        "query", "sortby", "orderby", "count"
      ]);

      //Lettura Attributi con valore vuoto
      AttributeReader.assertEmptyAttributes(this.value,
        function(param)
        {
          throw new MaasError(8000,
            "Unexpected parameter '" + param +
            "' in cell.value '" + self.toString() + "'");
        });
    }
    if (typeof this.value != "string" && typeof this.value !=
      "number" && typeof this.value != "object")
    {
      throw new MaasError(8000,
        "Unexpected value in cell.value '" + self.toString() +
        "'");
    }
  }

  //Metodi della Classe

  //Metodi Get
  getLabel()
  {
    return this.label;
  }
  getType()
  {
    return this.type;
  }

  //Metodo Costruzione Query
  buildQuery()
  {
    var stringQuery = '{}';
    if (typeof this.value == "string" || typeof this.value ==
      "number")
      return this.value;
    else
    if (typeof this.value == "object")
    {

      var findQuery = "db.collection('" + this.collection + "')";
      if (this.query)
      {
        stringQuery= JSON.stringify(this.query);
        if (this.select == "_id")
        {
          findQuery = findQuery + ".find(" + stringQuery +
            ",{ _id :1})";
        }
        else
        {
          findQuery = findQuery + ".find(" + stringQuery + ", {" +
            this.select + ":1, _id : 0})";
        }
      }
      else
      {
        if (this.select == "_id")
        {
          findQuery = findQuery + ".find({},{" + this.select +
            ":1})";
        }
        else
        {
          findQuery = findQuery + ".find({},{" + this.select +
            ":1, _id : 0})";
        }
      }
    }
    if (this.order == "desc")
    {
      var completeQuery = findQuery + ".sort(-" +
        this.sortby + ").limit(1)";
    }
    else
    {
      var completeQuery = findQuery + ".sort(" +
        this.sortby + ").limit(1)";
    }
    if (this.count == true && typeof this.count == "boolean")
    {
      return "db.collection('" + this.collection +
        "').aggregate([{ $match:" + stringQuery +
        " },{ $group: { _id: null, count: { $sum: 1 } } }])";
    }
    else
    {
      return completeQuery;
    }
  }

  //Metodo di specifica del tipo di DSL
  DSLType()
    {
      return "cell";
    }
    //Metodo Costruzione JSON
  JSONbuild(queryResult)
  {
    return {
      "properties":
      {
        "label": this.label,
        "DSLType": this.DSLType(),
        "returnType": this.getType(),
        "select": this.select
      },
      "data":
      {
        "result": queryResult
      }
    };
  }

  valueIsQuery()
  {
    if (typeof this.value == "object")
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  render(store)
  {
    if (this.valueIsQuery())
    {
      var query = this.buildQuery();
      if (this.flag)
      {
        this.flag = false;
        executeQuery(store.getState().currentDSLI, query, store
          .getState()
          .loggedUser.token, (err, res) =>
          { //LAUNCH OF A QUERY
            if (err) //CALLBACK FUNCTION WHERE QUERY ENDS
              return;
            console.log(res);
            this.storageResult = Object.assign(
            {}, res);
            store.dispatch(actions.refresh()); //CALL RENDER TO DISPLAY DATA
          });
      }
      if (this.storageResult.length != 0)
      {
        console.log("MODEL");
        this.show = true;
        this.JSON = this.JSONbuild(this.storageResult);
      }
    }
    else if (this.storageResult)
    {
      console.log("VANILLA");
      this.show = true;
      this.JSON = this.JSONbuild(this.storageResult);
    }

    if (this.show)
    {
      return <CellVisualize dsli = {
        store.getState().currentDSLI
      }
      JSON = {
        this.JSON
      }
      />
    }
    else
      return <div > Eseguendo le query... < /div>
  }
}
export default CellModel

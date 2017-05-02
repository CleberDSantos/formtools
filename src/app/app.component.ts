import { Component } from '@angular/core';
import * as _ from 'underscore';
import { formTools } from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public model: formTools = new formTools();
  constructor() {

    this.model.formName = "ScheduleH";
  }

  public execute() {
    this.toJsonPropreties();
    this.toTranslate();

  }

  private getContentClean(): any {

    let contentResult = [];
    let content = this.model.htmlInitialContent;

    content = content.replace(/&nbsp/g, "");
    content = content.replace(/\r?\n|\r/g, "").trim();

    let arrayContents = content.replace(/^\s*<[^>]*>\s*|\s*<[^>]*>\s*$|>\s*</g, '').split(/<[^>]*>/g);
    let contentsUniq = _.uniq(arrayContents, (item: any) => {
      return item;
    });

    let contentClean = _.without(contentsUniq, "");
    let ordeBYDesc = contentClean.reverse();

    ordeBYDesc.forEach((row: string) => {
      row = row.replace(/&nbsp/g, "");
      row = row.replace(/\r?\n|\r/g, "").trim();

      if (row.length < 4) { return; }

      contentResult.push(row);

    });

    contentResult = contentResult.sort(function (a, b) {
      // ASC  -> a.length - b.length
      // DESC -> b.length - a.length
      return b.length - a.length;
    });

    return contentResult;
  }

  public toJsonPropreties() {

    let ordeBYDesc = this.getContentClean();

    ordeBYDesc.forEach((row: string) => {

      let words = row.split(" ");
      var properties = [];
      let propertie = "";

      if (words.length >= 4) {

        for (var i = 0; i <= 3; i++) {
          let number = Math.floor(Math.random() * words.length);
          var item = words[number];

          properties.push({ "number": number, "item": item });
        }

        properties = _.sortBy(properties, 'number');

        properties.forEach((item: any) => {

          propertie += item.item.replace(/(\w)(\w*)/g, function (g0, g1, g2) { return g1.toUpperCase() + g2.toLowerCase(); });

        });

      } else {

        properties = words;

        properties.forEach((item: string) => {

          propertie += item.replace(/(\w)(\w*)/g, function (g0, g1, g2) { return g1.toUpperCase() + g2.toLowerCase(); });

        });
      }

      propertie = propertie.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');

      this.model.properties.push(propertie);

      var jsonline = `"${propertie}" : "${row}",`
      this.model.jsonPropertyResult += jsonline + "\n";
    });

    this.model.jsonPropertyResult = "{" + this.model.jsonPropertyResult.substring(0, this.model.jsonPropertyResult.length - 2) + "}";


  }

  private toTranslate() {

    let formObject = JSON.parse(this.model.jsonPropertyResult);
    let result: any = this.model.htmlInitialContent;

    for (var field in formObject) {

      let translateInstruction = `{{'${this.model.formName}.${field}'|translate}}`
      let beforeFieldContent = formObject[field];
      // result = this.replaceAll(beforeFieldContent,translateInstruction,result);

      result = result.split(beforeFieldContent).join(translateInstruction);

    }

    this.model.htmlTranslateResult = result;

  }


  private toModelPropertie(){  }
  private replaceAll(search: string, replacement: string, content: string) {
    return content.replace(new RegExp(search, 'g'), replacement);
  };

}

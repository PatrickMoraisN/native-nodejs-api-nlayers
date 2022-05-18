import { randomUUID } from "node:crypto";

export default class Hero { 
  constructor({id = '', name, age, power}) {
    !id ? this.id = randomUUID() : this.id = id;
    this.name = name;
    this.age = age;
    this.power = power;
  }
}
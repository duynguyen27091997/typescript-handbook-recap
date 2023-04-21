/* 
Trong TypeScript, abstract class là một lớp có thể được sử dụng để định nghĩa một lớp cơ sở cho các lớp khác. Một abstract class không thể được khởi tạo trực tiếp, nó chỉ có thể được kế thừa bởi các lớp khác để triển khai các phương thức và thuộc tính được định nghĩa trong abstract class.

Abstract class thường được sử dụng để định nghĩa các phương thức và thuộc tính chung cho một nhóm các lớp tương tự nhau. Khi một lớp kế thừa từ abstract class, nó phải triển khai tất cả các phương thức và thuộc tính được định nghĩa trong abstract class, nếu không TypeScript sẽ báo lỗi.
*/

abstract class StreetFighter {
  constructor() {
    // Constructor
  }

  move() {
    console.log('Moving');
  }
  fight() {
    console.log(`${this.name} attacks with ${this.getSpecialAttack()}`);
  }

  abstract getSpecialAttack(): string;
  abstract get name(): string;
}

class Ryu extends StreetFighter {
  getSpecialAttack(): string {
    return 'Hadoken';
  }
  get name(): string {
    return 'Ryu';
  }

  fight(): void {
    console.log('Attack 1000 damage');
  }
}

class ChunLi extends StreetFighter {
  getSpecialAttack(): string {
    return 'Lightning Kick';
  }
  get name(): string {
    return 'Chun-Li';
  }
}

const ryu = new Ryu();
const chunLi = new ChunLi();

ryu.fight();
chunLi.fight();

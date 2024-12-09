// ==UserScript==
// @name        New script google.com
// @namespace   Violentmonkey Scripts
// @match       https://www.google.com/search*
// @grant       none
// @version     1.0
// @author      -
// @description 2024/12/9 11:15:01
// ==/UserScript==

function getRatings() {
  const ratingsElements = document.getElementsByClassName("lTi8oc z3HNkc");
  let ratings = [];

  // 星評価を取り出して配列に保存
  // daysやratingsElementsはdisplay:noneのものも含めると重複して取っているため+=2
  for (let i = 0; i < ratingsElements.length; i+=2) {
    const text = ratingsElements[i].getAttribute("aria-label");
    const match = text.match(/(\d+(\.\d+)?)/g); // 小数も取得
    if (match && match.length > 1) {
      const rating = parseFloat(match[1]); // 2個目の数字が星の評価
      ratings.push(rating);
    }
  }

  if (ratings.length > 0) {
    const mean = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    const variance = ratings.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / ratings.length;
    console.log("合計口コミ件数:", ratings.length)
    console.log("星評価の平均:", mean);
    console.log("星評価の分散:", variance);
    console.log(ratings)
  } else {
    console.log("データがありません");
  }
}


function getDays() {
  const days = document.getElementsByClassName("dehysf");
  let numbers = [];

  // 数字を取り出して配列に保存
  for (let i = 0; i < days.length; i+=2) {
    let text = days[i].innerHTML;
    let number = parseInt(text.match(/\d+/)[0], 10);
    // "年" が含まれる場合は12を掛ける
    if (text.includes("年")) {
      number *= 12;
    }

    numbers.push(number);
  }


  if (numbers.length > 0) {
    let mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    let variance = numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numbers.length;
    console.log("平均何カ月前のレビューか:", mean, "カ月前");
    console.log("何カ月前のレビューかの分散:", variance);
    console.log(numbers)
  } else {
    console.log("データがありません");
  }
}


function getReviewCount() {
  const reviewElements = document.querySelectorAll('div.jxjCjc > div > a > span');
  let reviewCounts = [];

  reviewElements.forEach(element => {
    const text = element.textContent;
    const match = text.match(/(\d+)\s*件のレビュー/);
    if (match) {
      reviewCounts.push(parseInt(match[1], 10));
    }
  });

  if (reviewCounts.length > 0) {
    const mean = reviewCounts.reduce((a, b) => a + b, 0) / reviewCounts.length;
    console.log("レビュー件数の平均:", mean);
    console.log(reviewCounts)
  } else {
    console.log("レビュー件数データがありません");
  }
}


function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function main() {
  await wait(1000);
  // スクロール可能な要素を取得
  const scrollableElement = document.querySelector('.review-dialog-list');
  for (let i = 0; i < 2000; i++) {
    await wait(300);
    const scrollableElement = document.querySelector('.review-dialog-list');
    if (scrollableElement.scrollTop + scrollableElement.clientHeight !== scrollableElement.scrollHeight) {
    // 一番下にスクロール
      scrollableElement.scrollTop = scrollableElement.scrollHeight;
    } else break;
  }
  await wait(2000);
  getRatings()
  getDays();
  getReviewCount()
}


main()

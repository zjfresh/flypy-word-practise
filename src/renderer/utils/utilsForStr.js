export function randomStr(article, groupMap) {
  let str = '';
  let articleArr = [];

  groupMap.forEach((groupStr) => {
    if (article.includes(groupStr)) {
      articleArr.push(groupStr);
    }
  });

  const matchedGroupReg = new RegExp(articleArr.join('|'));
  articleArr = articleArr.concat(article
    .split(matchedGroupReg).filter(s => Boolean(s.trim()) && s.trim() !== '——'));

  const randomGroupNumArr = Array.from({ length: articleArr.length }, (_, index) => index);
  while (randomGroupNumArr.length) {
    const randomIndex = Math.floor(Math.random() * randomGroupNumArr.length);
    str += articleArr[randomGroupNumArr.splice(randomIndex, 1)];
  }

  return str;
}

export function findDifferent(rightStr, checkStr) {
  let errorOutput = '';
  let rightOutput = '';
  for (let i = 0, j = 0; i < rightStr.length || j < checkStr.length;) {
    const rightChar = rightStr[i];
    const checkChar = checkStr[j];
    if (!rightChar) {
      errorOutput += checkStr[j];
      j += 1;
    } else if (!checkChar) {
      rightOutput += rightStr[i];
      i += 1;
    } else if (checkChar !== rightChar) {
      let isBehindMatch = false; // checkChar 与后面的 rightChar 匹配
      let matchIndex = i + 1;
      for (; matchIndex < rightStr.length; matchIndex += 1) {
        if (rightStr[matchIndex] === checkChar) {
          isBehindMatch = true;
          break;
        }
      }

      if (isBehindMatch) {
        errorOutput += '<span style="visibility: hidden;">';

        while (i < matchIndex) {
          errorOutput += rightStr[i]; // errorOutput 增加空白内容，保持与 rightOutput 的上下对位
          rightOutput += rightStr[i];
          i += 1;
        }
        errorOutput += '</span>';

        rightOutput += rightStr[i];
        errorOutput += rightStr[i];
        // rightStr[i => matchIndex] 即 checkChar
      } else {
        let isFrontMatch = false; // rightChar 与后面的 checkChar 匹配， checkChar 为多余字符
        let matchIndex = j + 1;
        for (; matchIndex < checkStr.length; matchIndex += 1) {
          if (checkStr[matchIndex] === rightChar) {
            isFrontMatch = true;
            break;
          }
        }

        if (isFrontMatch) {
          rightOutput += '<span style="visibility: hidden;">';

          while (j < matchIndex) {
            rightOutput += checkStr[j]; // rightOutput 增加空白内容，保持与 errorOutput 的上下对位
            errorOutput += checkStr[j];
            j += 1;
          }
          rightOutput += '</span>';

          errorOutput += checkStr[j];
          rightOutput += checkStr[j];
          // checkStr[j => matchIndex] 即 rightChar
        } else {
          const highlightStart = ' <span style="color: teal;font-weight: bolder;">';
          const highlightEnd = '</span> ';
          errorOutput += highlightStart;
          rightOutput += highlightStart;
          errorOutput += checkChar;
          rightOutput += rightChar;
          errorOutput += highlightEnd;
          rightOutput += highlightEnd;
        }
      }
      i += 1;
      j += 1;
    } else {
      errorOutput += checkChar;
      rightOutput += rightChar;
      i += 1;
      j += 1;
    }
  }
  return {
    rightOutput,
    errorOutput,
  };
}

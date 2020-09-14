<template>
  <section class="home_page">
    <p>
      <select
        v-model="articleName"
        class="article_name"
        @change="onChange()"
      >
        <option
          v-for="(name, index) in articleKeys"
          :key="index"
          :value="name"
        >
          {{ name }}
        </option>
      </select>
      <input
        v-model.number="limitNum"
        type="number"
        class="number"
        @keyup.enter.prevent="onChange()"
      >
      <br>
      <label for="random">文章乱序</label>
      <input
        v-model="randomArticle"
        type="checkbox"
        name="random"
      >
      <label for="random">组乱序</label>
      <input
        v-model="randomFlag"
        type="checkbox"
        name="random"
      >
      <br>
      <label for="repeat">重复练习</label>
      <input
        v-model="repeatPractice"
        type="checkbox"
        name="repeat"
      >
    </p>
    <div class="match">
      <span
        v-for="(char, index) in currentText"
        :key="index"
        class="to_matched_char"
        :class="{
          is_error: userInputText.length > index && userInputText[index] !== char,
          is_right: userInputText.length > index && userInputText[index] === char
        }"
      >{{ char }}</span>
    </div>
    <div>
      <textarea
        v-model="userInputText"
        type="text"
        class="result"
        @keydown.enter.prevent
        @keydown="keydownAction"
        @keyup.enter.prevent="submit()"
      />
      <p class="keyshortcut_tip">
        ← ctrl + left; ctrl + right →
      </p>
    </div>
    <br>
    <div class="status">
      <p class="step">
        第<input
          v-model.number="currentStep"
          type="number"
          class="current_step"
          min="1"
          :max="articleSteps && articleSteps.length || 0"
        >/{{ articleSteps && articleSteps.length || 0 }}段
      </p>
    </div>
    <br>
    <button
      class="btn"
      @click="prev()"
    >
      上一段
    </button>
    <button
      class="btn"
      @click="next()"
    >
      下一段
    </button>
    <button
      class="btn"
      @click="submit()"
    >
      提交
    </button>
    <br><br>
    <!-- eslint-disable vue/no-v-html -->
    <div
      class="tip_info"
      v-html="tipText"
    />
    <!-- eslint-enable vue/no-v-html -->
  </section>
</template>
<script>
import { articleKeys, getArticle } from '@/utils/getArticle.js';

import { findDifferent, randomStr } from '@/utils/utilsForStr.js';

export default {
  name: 'Home',
  data() {
    return {
      currentStep: 0,
      articleSteps: null,
      currentText: '',
      userInputText: '',
      tipText: '',
      limitNum: 10,
      articleName: '',
      randomFlag: true,
      randomArticle: false,
      repeatPractice: true,
      articleKeys,
      localSaveKey: [
        'repeatPractice',
      ],
    };
  },
  watch: {
    randomArticle: 'onChange',
    currentStep: 'show',
    randomFlag: 'show',
    userInputText(val) {
      if (val.length >= this.currentText.length) {
        this.submit(true);
      }
    },
    repeatPractice: 'saveToLocal',
  },
  mounted() {
    if (localStorage.currentArtcleName) {
      this.articleName = localStorage.currentArtcleName;
    } else {
      [this.articleName] = this.articleKeys;
    }
    this.localSaveKey.forEach((key) => {
      this[key] = this.revertToValue(localStorage[key]);
    });
    this.onChange(+localStorage.currentStep);
  },
  methods: {
    keydownAction(e) {
      if (e.ctrlKey || e.metaKey) {
        if (e.keyCode === 39) {
          this.next();
        } else if (e.keyCode === 37) {
          this.prev();
        }
      }
    },
    splitArticle(article, step) {
      const strArr = [];
      if (/\s/.test(article)) {
        let nowStepNum = 0;
        strArr.push('');
        article.split(/\s/).forEach((group) => {
          if (group.length + nowStepNum < this.limitNum) {
            nowStepNum += group.length;
            strArr[strArr.length - 1] += group;
          } else {
            strArr.push('');
            nowStepNum = 0;
          }
        });

        this.randomFlag = false;
      } else {
        for (let i = 0; i < article.length; i += 1) {
          if (i % this.limitNum === 0) strArr.push('');
          strArr[strArr.length - 1] += article[i];
        }
      }
      this.articleSteps = strArr;
      this.currentStep = step || 1;
    },
    show() {
      let text = this.articleSteps[this.currentStep - 1];
      localStorage.currentStep = this.currentStep;

      if (!text) return;
      if (this.randomFlag) {
        text = randomStr(text);
      }
      this.currentText = text;

      this.userInputText = '';
      this.tipText = '';
    },
    submit(isAutoSubmit) {
      if (this.tipText === '' && this.currentText === '') return;

      const inputStr = this.userInputText;
      const toMatchedStr = this.currentText;
      if (toMatchedStr !== inputStr) {
        const { rightOutput, errorOutput } = findDifferent(toMatchedStr, inputStr);

        this.tipText = `right: ${rightOutput}<br>`
        + `error: ${errorOutput}<br>`;
      } else {
        this.tipText = '√';
        if (!isAutoSubmit) {
          if (this.repeatPractice) {
            this.show();
          } else {
            this.next();
          }
        } else if (this.repeatPractice) {
          this.show();
        }
      }
    },
    onChange(step) {
      localStorage.currentArtcleName = this.articleName;
      let article = getArticle(this.articleName);
      if (this.randomArticle) {
        article = randomStr(article);
      }

      this.splitArticle(article, typeof step === 'number' ? step : 0);
      this.show();
    },
    prev() {
      if (this.currentStep > 1) {
        this.currentStep -= 1;
        this.show();
      }
    },
    next() {
      if (this.currentStep < this.articleSteps.length) {
        this.currentStep += 1;
        this.show();
      }
    },
    saveToLocal() {
      this.localSaveKey.forEach((key) => {
        if (typeof this[key] !== 'undefined')localStorage[key] = this[key];
      });
    },
    revertToValue(str) {
      switch (str) {
        case 'true':
          return true;
        case 'false':
          return false;
        default:
          if (!Number.isNaN(+str)) {
            return +str;
          } else if (/^[\\{\\[]/.test(str) && /[\\}\]]$/.test(str)) {
            try {
              return JSON.parse(str);
            } catch (err) {
              window.console.error(err);
              return str;
            }
          }
          return str;
      }
    },
  },
};
</script>
<style lang="scss">
.home_page {
  padding-top: 50px;
  padding-left: 50px;

  .match {
    margin: 20px 0;

    .to_matched_char {
    &.is_right {
      color: teal;
    }
    &.is_error {
      color: red;
    }
  }
  }

  .article_name {
    width: 150px;
  }

  .status {
    .current_step {
      width: 35px;
    }
  }
  .result {
    width: 200px;
    height: 30px;
    resize:none;

    &:focus {
      outline: none;
    }
  }

  .keyshortcut_tip {
    font-size: 12px;
    color: #cecece;
    margin: 0;
  }

  .btn {
    padding: 3px 10px;
    border: solid 1px #ccc;
    background-color: #FFF;
    border-radius: 3px;
  }
}
</style>

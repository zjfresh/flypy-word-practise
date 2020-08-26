<template>
  <section class="home_page">
    <div class="match">
      {{ currentText }}
    </div>
    <p>
      <select
        v-model="articleName"
        class="article_name"
        @change="onChange"
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
        v-model="limitNum"
        type="number"
        class="number"
        @keyup.enter="onChange"
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
      <label for="repeat">重复练习</label>
      <input
        v-model="repeatPractice"
        type="checkbox"
        name="repeat"
      >
    </p>
    <div class="status">
      <p class="step">
        第{{ currentStep }}/{{ articleSteps && articleSteps.length || 0 }}段
      </p>
    </div>
    <p>
      <textarea
        v-model="userInputText"
        type="text"
        class="result"
        @keydown.enter.prevent
        @keydown="keydownAction"
        @keyup.enter.prevent="submit"
      />
    </p>
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
      @click="submit"
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
    };
  },
  watch: {
    randomArticle: 'onChange',
    randomFlag: 'show',
    userInputText(val) {
      if (val.length >= this.currentText.length) {
        this.submit(true);
      }
    },
  },
  mounted() {
    [this.articleName] = this.articleKeys;
    this.onChange();
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
    splitArticle(article) {
      const strArr = [];
      for (let i = 0; i < article.length; i += 1) {
        if (i % this.limitNum === 0) strArr.push('');
        strArr[strArr.length - 1] += article[i];
      }
      this.articleSteps = strArr;
      this.currentStep = 1;
    },
    show() {
      let text = this.articleSteps[this.currentStep - 1];
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
        }
      }
    },
    onChange() {
      let article = getArticle(this.articleName);
      if (this.randomArticle) {
        article = randomStr(article);
      }

      this.splitArticle(article);
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
  },
};
</script>
<style lang="scss">
.home_page {
    padding: 50px 50px;

    .article_name {
      width: 150px;
    }

    .result {
      width: 200px;
      height: 30px;
      resize:none;

      &:focus {
        outline: none;
      }
    }
}
</style>

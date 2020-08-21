<template>
  <section class="home_page">
    <div class="match">
      {{ answerStr }}
    </div>
    <p>
      <input
        v-model="num"
        type="number"
        class="number"
        @keyup.enter="getMatch"
      >
    </p>
    <p>
      <textarea
        v-model="userInputStr"
        type="text"
        class="result"
        @keydown.enter.prevent
        @keyup.enter.prevent="submit"
      />
    </p>
    <button
      class="btn"
      @click="getMatch()"
    >
      获取
    </button>
    <button
      class="btn"
      @click="submit"
    >
      提交
    </button>
    <br><br>
    <!--eslint-disable vue/no-v-html -->
    <div
      class="tip_info"
      v-html="tipText"
    />
    <!--eslint-enable vue/no-v-html -->
  </section>
</template>
<script>
export default {
  name: 'Heom',
  data() {
    return {
      strArr: '的一是了不在有个人这上中大为来我到出要以时和地们得可下对生也子就过能他会多发说而于自之用年行家方后作成开面事好小心前所道法如进着同经分定都然与本还其当起动已两点从问里主实天高去现长此三将无国全文理明日些看只公等十意正外想间把情者没重相那向知因样学应又手但信关使种见力名二处门并口么先位头回话很再由身入内第平被给次别几月真立新通少机打水果最部何安接报声才体今合性西你放表目加常做己老四件解路更走比总金管光工结提任东原便美及教难世至气神山数利书代直色场变记张必受交非服化求风度太万各算边王什快许连五活思该步海指物则女或完马强言条特命感清带认保望转传儿制干计民白住字它义车像反象题却流且即深近形取往系量论告息让决未花收满每华业南觉电空眼听远师元请容她军士百办语期北林识半夫客战院城候单音台死视领失司亲始极双令改功程爱德复切随李员离轻观青足落叫根怎持精送众影八首包准兴红达早尽故房引火站似找备调断设格消拉照布友整术石展紧据终周式举飞片虽易运笑云建谈界务写钱商乐推注越千微若约英集示呢待坐议乎留称品志黑存六造低江念产刻节尔吃势依图共曾响底装具喜严九况跟罗须显热病证刚治绝群市阳确究久除闻答段官政类黄武七支费父统府'.split(''),
      answerStr: '',
      userInputStr: '',
      tipText: '',
      num: 10,
    };
  },
  mounted() {
    this.getMatch();
  },
  methods: {
    getMatch() {
      let out = '';
      const strArr = [...this.strArr];
      let { num } = this;
      while (num) {
        const random = Math.floor(Math.random() * strArr.length);
        out += strArr.splice(random, 1);
        num -= 1;
      }
      this.answerStr = out;
    },
    submit() {
      if (this.tipText === '' && this.answerStr === '') return;

      const inputStr = this.userInputStr;
      if (this.answerStr !== inputStr) {
        let errorOutput = '';
        let rightOutput = '';
        for (let i = 0, j = 0; i < this.answerStr.length || j < inputStr.length;) {
          const rightChar = this.answerStr[i];
          const userChar = inputStr[j];
          if (!rightChar) {
            errorOutput += inputStr[j];
            j += 1;
          } else if (!userChar) {
            rightOutput += this.answerStr[i];
            i += 1;
          } else if (userChar !== rightChar) {
            let isBehindMatch = false; // 少打一个字符，当前字符与后面的匹配
            let matchIndex = i + 1;
            for (; matchIndex < this.answerStr.length; matchIndex += 1) {
              if (this.answerStr[matchIndex] === userChar) {
                isBehindMatch = true;
                break;
              }
            }

            if (isBehindMatch) {
              errorOutput += '<span style="visibility: hidden;">';

              while (i < matchIndex) {
                errorOutput += this.answerStr[i];
                rightOutput += this.answerStr[i];
                i += 1;
              }
              errorOutput += '</span>';

              rightOutput += this.answerStr[i];
              errorOutput += this.answerStr[i];
              // this.answerStr[i => matchIndex] 即 userChar
            } else {
              let isFrontMatch = false; // 多打一个字符，后面的字符与当前正确字匹配
              let matchIndex = j + 1;
              for (; matchIndex < this.userInputStr.length; matchIndex += 1) {
                if (this.userInputStr[matchIndex] === rightChar) {
                  isFrontMatch = true;
                  break;
                }
              }

              if (isFrontMatch) {
                rightOutput += '<span style="visibility: hidden;">';

                while (j < matchIndex) {
                  rightOutput += this.userInputStr[j];
                  errorOutput += this.userInputStr[j];
                  j += 1;
                }
                rightOutput += '</span>';

                errorOutput += this.userInputStr[j];
                rightOutput += this.userInputStr[j];
                // this.userInputStr[j => matchIndex] 即 rightChar
              } else {
                const highlightStart = ' <span style="color: teal;font-weight: bolder;">';
                const highlightEnd = '</span> ';
                errorOutput += highlightStart;
                rightOutput += highlightStart;
                errorOutput += userChar;
                rightOutput += rightChar;
                errorOutput += highlightEnd;
                rightOutput += highlightEnd;
              }
            }
            i += 1;
            j += 1;
          } else {
            errorOutput += userChar;
            rightOutput += rightChar;
            i += 1;
            j += 1;
          }
        }

        this.tipText = `right: ${rightOutput}<br>`
        + `error: ${errorOutput}<br>`;
      } else {
        this.tipText = '√';
      }
    },
  },
};
</script>
<style lang="scss">
.home_page {
    padding: 50px 50px;

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

<template>
  <v-container>
    <v-row class=" d-flex justify-center align-center">
      <v-col class="mb-4" xl="6" lg="8" md="10" sm="10" xs="12">
        <h1 class="display-3 font-weight-bold my-5 mb-9">
          Tool Ôn thi OOAD
        </h1>
        <!-- Tìm kiếm -->
        <v-textarea
          solo
          label="Nhập từ khóa tìm kiếm vào đây!"
          v-model="textSearch"
          @keyup="onChangeSearch"
        ></v-textarea>
        <!-- Button -->
        <v-row align="center" justify="space-around" class="mx-0 mb-5 mt-1">
          <v-btn @click="handleShowAllQuestion" depressed color="primary" large>
            Hiện thị tất cả câu hỏi
          </v-btn>
          <v-btn v-if="isShowAnswer" @click="showAnswer" depressed color="info" large>
            Ẩn thị đáp án
          </v-btn>
          <v-btn v-else @click="showAnswer" depressed color="info" large>
            Hiện thị đáp án
          </v-btn>
        </v-row>

        <div v-for="(quiz, index) in quizsDisplay" :key="index">
          <p class="display-1 font-weight-bold my-7">
            {{ nameQuizs[index] }}
          </p>

          <p v-if="quiz.length == 0" class="title font-weight-regular mb-0">
            Không có câu hỏi được tìm thấy!
          </p>

          <div v-for="(item, indexItem) in quiz" :key="item.key">
            <!-- Title -->
            <p class="title font-weight-bold mb-0">
              {{ item.key }}. {{ item.question_text }}
            </p>
            <p class="title font-weight-regular">
              {{ item.question_code }}
            </p>
            <!-- Answers -->
            <div class="">
              <div
                style="cursor: pointer;"
                class="subtitle-1  mb-1"
                v-for="(option, indexOpt) in item.option"
                :key="indexOpt"
                @click="handleClickAnswer(index, indexItem, indexOpt)"
                
              >
                <v-icon v-if="isShowAnswer" class="pb-1" color="green darken-2" :style="{opacity: handleStateAnswer( indexOpt, item.answer)}">
                  mdi-checkbox-marked-circle
                </v-icon>
                
                <span :class="{'font-weight-bold primary--text': item.tick[indexOpt]}">  {{ alphabet[indexOpt] }}. {{ option }}</span>
              </div>
            </div>

            <p v-if="isShowAnswer && item.answer.length > 1" class="title font-weight-bold mb-0 mt-3">
              Thứ tự đáp áp: {{item.answer}}
            </p>
            <p v-if="isShowAnswer && item.answer.length > 1" class="title font-weight-regular mb-0">
              Chú ý: 0 tương ứng với A, 1 tương ứng với B, 2 tương ứng C, 3 tương ứng D,...
            </p>
            <v-divider class="my-5"></v-divider>
          </div>
          <v-divider class="mb-7"></v-divider>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Example",
  mounted() {
    // Đọc file JSON
    var thisExam = this;

    for (const key in thisExam.urlData) {
      const element = thisExam.urlData[key];
      thisExam.readTextFile(element, function(text) {
        //Thêm Key vào mảng
        let quiz = JSON.parse(text);
        let index = 1;
        for (const keyQuiz in quiz) {
          // Thêm index
          const element = quiz[keyQuiz];
          element.key = index;

          // Khỏi tại phẩn đánh dấu
          quiz[keyQuiz].tick = [];
          for(let i = 0; i < quiz[keyQuiz].option.length; i++){
            quiz[keyQuiz].tick.push(false);
          }

          index++;
        }

        thisExam.quizs.push(quiz);
      });
    }

    setTimeout(function() {
      thisExam.quizsDisplay = thisExam.quizs;
    }, 400);
  },
  data() {
    return {
      // Mảng lưu dữ liệu gốc
      quizs: [],
      // Mảng dữ liệu hiển thị
      quizsDisplay: [],
      urlData: ["/qz1.json", "/qz2.json", "/qz3.json"],
      nameQuizs: [
        "Quiz 1: IBM 000-486 (OOAD with UML) (50 questions)",
        "Quiz 2: IBM 000-486 (OOAD with UML) (27 questions)",
        "Quiz 3: IBM 000-486 (OOAD with UML) Final Exam (154 questions)",
      ],
      alphabet: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
      ],

      // Trường tìm kiếm hiện tại
      textSearch: "",
      // Trạng thái hiển thị tất cả
      isDisplayAll: true,
      // Trạng thái hiển thị đáp án
      isShowAnswer: false,
    };
  },
  methods: {
    /**
     * Hàm để Test chức năng
     * Created By: LMCUONG(14/08/2021)
     */
    onClickTest() {
      console.log(this.quizsDisplay);
    },
    /**
     * Hàm học File JSON
     * @param {string} file đường dẫn file
     * @param {function} callback trả về một hàm có kết quả là file json
     * @returns {}
     * Created By: LMCUONG(14/08/2021)
     */
    readTextFile(file, callback) {
      var rawFile = new XMLHttpRequest();
      rawFile.overrideMimeType("application/json");
      rawFile.open("GET", file, true);
      rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
          callback(rawFile.responseText);
        }
      };
      rawFile.send(null);
    },
    /** 
    * Khi ký tự thay đổi trong ô tìm kiếm
    * Created By: LMCUONG(15/08/2021) 
    */
    onChangeSearch() {

      this.isShowAnswer = true;

      let quizsSearch = [];
      for (const key in this.quizs) {
        let quizSearch = this.quizs[key].filter((question) => {
          return this.searchQuestion(question);
        });
        quizsSearch.push(quizSearch);
      }

      this.quizsDisplay = quizsSearch;
    },
    searchQuestion(question) {
      let textSearch = this.textSearch.toLowerCase();

      let isValid =
        question.question_text.toLowerCase().includes(textSearch) ||
        question.question_code.toLowerCase().includes(textSearch);

      if (!isValid) {
        for (const iterator of question.option) {
          if (iterator.toLowerCase().includes(textSearch)) {
            isValid = true;
            break;
          }
        }
      }

      return isValid;
    },
    /**
     * Hiện thị đáp án
     * Created By: LMCUONG(15/08/2021)
     */
    showAnswer() {
      this.isShowAnswer = !this.isShowAnswer;
    },
    /** 
    * Xử lý hiển thị dấu tích đáp án hay không
    * @param {}  
    * @returns {number} 1 - nếu có đáp án, 0 - nếu không có đáp án  
    * Created By: LMCUONG(15/08/2021) 
    */
    handleStateAnswer( indexOpt, answer){

      if(answer.includes(`${indexOpt}`)){
        return 1
      }
      else{
        return 0;
      }

    },
    handleShowAllQuestion(){
      this.textSearch = "";
      this.onChangeSearch();
    },
    handleClickAnswer(index, indexItem, indexOpt){
      // this.quizsDisplay[index][indexItem].tick[indexOpt] = !this.quizsDisplay[index][indexItem].tick[indexOpt];
      this.quizsDisplay[index][indexItem].tick.splice(indexOpt, 1, !this.quizsDisplay[index][indexItem].tick[indexOpt])
      console.log(this.quizsDisplay[index][indexItem].tick[indexOpt]);

    }
  },
};
</script>

<style scoped></style>

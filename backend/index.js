const apiKey = "sk-";
const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const cors = require("cors");
const app = express();

const configuration = new Configuration({
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

// CORS 이슈 해결, 어디서 요청이 온 건지 확인하는 과정
// let corsOptions = {
//   origin: "https://chatdoge-test-60g.pages.dev/",
//   credentials: true,
// };
app.use(cors());

// POST 요청 받을 수 있게
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// POST method route
app.post("/fortuneTell", async function (req, res) {
  let { myDateTime, userMessages, assistantMessages } = req.body;
  console.log(userMessages);
  console.log(assistantMessages);

  let todayDateTime = new Date().toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
  });
  let messages = [
    {
      role: "system",
      content:
        "당신은 세계 최고의 점성술사입니다. 당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신의 이름은 챗도지입니다.  당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다.",
    },
    {
      role: "user",
      content:
        "당신은 세계 최고의 점성술사입니다. 당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신의 이름은 챗도지입니다.  당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다.",
    },
    {
      role: "assistant",
      content:
        "안녕하세요, 저는 챗도지입니다. 무엇을 도와드릴까요? 운세, 삶의 방향성, 사랑, 직업, 건강 등 여러 가지 주제에서 질문 을 받고 있습니다. 질문해 주시면 최대한 자세하고 명확하게 답변해 드리도록 노력하겠습니다.",
    },
    {
      role: "user",
      content: `저의 생년월일과 태어난 시간은 ${myDateTime}입니다. 오늘은 ${todayDateTime} 입니다.`,
    },
    {
      role: "assistant",
      content: `당신의 생년월일과 태어난 시간은 ${myDateTime}인 것을 확인하였습니다. 운세에 대해서 어떤 것이든 물어보세요! 그리고 오늘은 ${todayDateTime}인 것도 확인하였습니다.`,
    },
  ];

  while (userMessages.length != 0 || assistantMessages.length != 0) {
    if (userMessages.length != 0) {
      messages.push(
        JSON.parse(
          '{"role": "user", "content": "' +
            String(userMessages.shift()).replace(/\n/g, "") +
            '"}'
        )
      );
    }
    if (assistantMessages.length != 0) {
      messages.push(
        JSON.parse(
          '{"role": "assistant", "content": "' +
            String(assistantMessages.shift()).replace(/\n/g, "") +
            '"}'
        )
      );
    }
  }

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
  });

  let fortune = completion.data.choices[0].message["content"];
  console.log(fortune);
  res.json({ assistant: fortune }); //json 응답으로 받기
});

//module.exports.handler = serverless(app);

app.listen(3000);

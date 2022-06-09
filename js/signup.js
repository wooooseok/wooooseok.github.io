class Guestbook {
    constructor(userId, pwd, pwdCheck, userName, ssn1, ssn2, email, tel1, tel2, tel3, job){
      this.userId = userId;
      this.pwd = pwd;
      this.pwdCheck = pwdCheck;
      this.userName = userName;
      this.ssn1 = ssn1;
      this.ssn2 = ssn2;
      this.email = email;
      this.tel1 = tel1;
      this.tel2 = tel2;
      this.tel3 = tel3;
      this.job = job;
    }
  }

  document.querySelector("#pwdCheck").onblur = isEqualPwd; 

  document.guestbookFrm.onsubmit = function () {
    const userId = document.getElementById("userId");
    const pwd = document.getElementById("pwd");
    const pwdCheck = document.getElementById("pwdCheck");
    const userName = document.getElementById("userName");
    const email = document.getElementById("email");
    const ssn1 = document.getElementById("ssn1");
    const ssn2 = document.getElementById("ssn2");
    const tel1 = document.getElementById("tel1");
    const tel2 = document.getElementById("tel2");
    const tel3 = document.getElementById("tel3");

    //1.아이디검사
    //첫글자는 반드시 영소문자로 이루어지고,
    //아이디의 길이는 4~12글자사이
    //숫자가 하나이상 포함되어야함.
    const regExp1 = /^[a-z][a-z\d]{3,11}$/;
    const regExp2 = /[0-9]/;
    if(!regExpTest(regExp1
                  ,userId
                  ,"아이디는 영소문자로 시작하는 4~12글자입니다."))
        return false; // submit핸들러 기본 작동(submit)을 방지
    if(!regExpTest(regExp2
                  ,userId
                  ,"아이디는 숫자를 하나이상 포함하세요."))
        return false;

    //2.비밀번호 확인 검사
    //숫자/문자/특수문자/ 포함 형태의 8~15자리 이내의 암호 정규식
    //전체길이검사 /^.{8,15}$/
    //숫자하나 반드시 포함 /\d/
    //영문자 반드시 포함 /[a-zA-Z]/
    //특수문자 반드시 포함  /[\\*!&]/

    const regExpArr = [/^.{8,15}$/, /\d/, /[a-zA-Z]/, /[\\*!&]/];

    for (let i = 0; i < regExpArr.length; i++) {
      if (
        !regExpTest(
          regExpArr[i],
          pwd,
          "비밀번호는 8~15자리 숫자/문자/특수문자를 포함해야합니다."
        )
      ) {
        return false;
      }
    }

    //비밀번호일치여부
    if (!isEqualPwd()) {
      return false;
    }

    //3.이름검사
    //한글2글자 이상만 허용.
    const regExp3 = /^[가-힣]{2,}$/;
    if (!regExpTest(regExp3, userName, "한글2글자이상 입력하세요."))
      return false;

    //4.주민번호체크
    const regExp4 = /^\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[01])$/;
    const regExp5 = /^[1234]\d{6}$/;
    if (!regExpTest(regExp4, ssn1, "숫자만 입력하세요.")) return false;
    if (!regExpTest(regExp5, ssn2, "숫자만 입력하세요.")) return false;

    if (!ssnCheck(ssn1.value, ssn2.value)) {
      alert("올바른 주민번호가 아닙니다.");
      return false;
    }

    //5.이메일 검사
    // 4글자 이상(\w = [a-zA-Z0-9_], [\w-\.]) @가 나오고
    // 1글자 이상(주소). 글자 가 1~3번 반복됨
    if (
      !regExpTest(
        /^[\w]{4,}@[\w]+(\.[\w]+){1,3}$/,
        email,
        "이메일 형식에 어긋납니다."
      )
    )
      return false;

    //6. 전화번호 검사
    // 전화번호 앞자리는 010, 두번째 자리는 3~4자리 숫자, 세번째 자리는 4자리 숫자
    if (!regExpTest(/^010$/, tel1, "앞번호 010 입력")) 
      return false;
    if (!regExpTest(/^[0-9]{3,4}$/, tel2, "번호 3자리 이상 입력"))
      return false;
    if (!regExpTest(/^[0-9]{4}$/, tel3, "4자리 번호 입력"))
      return false;

    return true;
  };

  function ssnCheck(ssn1, ssn2) {
    const ssn = ssn1 + ssn2;
    /*
        주민등록번호 체계 및 유효성 검사 (javascript)	
        https://eyecandyzero.tistory.com/240	

        //900909-1234561
        const total = 9*2 + 0*3 + 0*4 + 9*5 + 0*6 + 9*7 + 1*8 + 2*9 + 3*2 + 4*3 + 5*4 + 6*5;//220
        const result = total%11;//0
        result = 11-0;//11
        result = result%10;//1

        if(result == 13번째자리수) return true;
        else return false; 

    */
    let total = 0;
    for (let i = 0; i < 12; i++) {
      if (i < 8) {
        total += parseInt(ssn.substr(i, 1)) * (i + 2);
      } else {
        total += parseInt(ssn.substr(i, 1)) * (i - 6);
      }
    }
    //마지막수와 비교할 수 구하기
    const result = (11 - (total % 11)) % 10;
    //마지막수(13번째 자리)
    const num13 = parseInt(ssn.substr(12, 1));
    //결과
    if (result === num13) return true;
    else return false;
  }

  function isEqualPwd() {
    if (pwd.value === pwdCheck.value) {
      return true;
    } else {
      alert("비밀번호가 일치하지 않습니다.");
      pwd.select();
      return false;
    }
  }

  function regExpTest(regExp, el, msg) {
    if (regExp.test(el.value)) return true;
    //적합한 문자열이 아닌 경우
    alert(msg);
    el.value = "";
    el.focus();
    return false;
  }

  const saveGuestbook = () => {
    // 사용자입력값
    const userIdVal = userId.value;
    const pwdVal = pwd.value;
    const pwdCheckVal = pwdCheck.value;
    const userNameVal = userName.value;
    const ssn1Val = ssn1.value;
    const ssn2Val = ssn2.value;
    const emailVal = email.value;
    const tel1Val = tel1.value;
    const tel2Val = tel2.value;
    const tel3Val = tel3.value;
    const jobVal = job.value;

    // guestbook객체
    const guestbook = new Guestbook(userIdVal, pwdVal, pwdCheckVal, userNameVal, ssn1Val, ssn2Val, emailVal, tel1Val, tel2Val, tel3Val, jobVal);
    
    // 배열에 저장
    const guestbooks = JSON.parse(localStorage.getItem("guestbooks")) || [];
    guestbooks.push(guestbook);
    console.log(guestbooks);

    // json
    const data = JSON.stringify(guestbooks);
    console.log(data);
    
    // localStorage에 저장
    localStorage.setItem('guestbooks', data);

    // 초기화
    document.guestbookFrm.reset();

    //렌더링
    renderGuestbook(guestbooks);
  };

  const renderGuestbook = (guestbooks = JSON.parse(localStorage.getItem("guestbooks"))) => {
    if(!guestbooks) return;
    const tbody = document.querySelector("#tb-guestbook tbody");
    tbody.innerHTML = "";
    guestbooks
      .map((guestbook, index) => {
        const {userId, pwd, userName, ssn1, ssn2, email, tel1, tel2, tel3, job} = guestbook;
        return `<tr>
          <td>${index + 1}</td>
          <td>${userId}</td>
          <td>${pwd}</td>
          <td width="100">${userName}</td>
          <td>${ssn1+'-'+'*******'}</td>
          <td>${email}</td>
          <td>${tel1+'-'+'****'+'-'+tel3}</td>
          <td>${job}</td>
        </tr>`;
      })
      .forEach((tr) => {
        tbody.innerHTML += tr;
      });
  }

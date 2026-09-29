(() => {
  "use strict";
  const QNA = "https://star.moe.go.kr/web/contents/m30103.do?id=113843&schM=view";
  const NOTEBOOK = "https://notebook.google.com/";
  const CLASSROOM = "https://classroom.google.com/ai/cm";
  const SEN = "https://senedu.kr/";
  const SENGPT = "https://gov.wrks.ai/ko/agent";
  const PADLET = "https://padlet.com/cdl_pad/sen-bit-ly-26-y5ol4z7w9flg8das";
  const promptNotebook = "등록한 Q&A의 답변 본문만 사용하세요. ‘과제형 수행평가’가 무엇을 가리키는지와 수업 중 직접 관찰 원칙을 간단히 설명하고 해당 문장에 실제 인용을 연결하세요. 교사용 적용 제안은 별도로 한 줄만 쓰세요. 모든 숙제나 모든 AI 사용이 금지라는 결론, 새로운 배점, 자동 0점, AI 사용 기록 제출 의무를 만들지 마세요. 본문에서 확인되지 않는 것은 ‘이 자료에서 확인되지 않음’이라고 쓰세요.";
  const promptEightSource = "등록 Source 8개를 정확히 8행으로 비교하세요. 반드시 행 제목: ① 한영고 2026 학교교육계획 ② 교육부 2025 AI 수행평가 보도자료 ③ 서울교육청 2026 고등학교 학업성적관리 시행지침 ④ KERIS 포털 과제형 수행평가 공식 Q&A ⑤ Bastani 외 고교 수학 실험 ⑥ OECD Digital Education Outlook 2026 ⑦ OECD-EU Empowering Learners for the Age of AI ⑧ 개인정보위 생성형 AI 이용자 가이드. 열은 Source / 문서 성격 / 학생평가 직접 내용 / AI 쟁점 / 교사용 적용 제안 / 한계·주의. 각 행의 직접 내용은 해당 Source만 사용하고 다른 문서 내용을 섞지 마세요. 근거 없는 셀은 ‘직접 언급 없음’. 제안은 제안으로 표시하세요. 문서명 또는 실제 인용만 연결하며 임의 인용 번호는 만들지 마세요.";
  const promptClassroom = "고등학교 학생의 생성형 AI 활용과 평가. 교사용 탐구 지도 초안이며 학교 공식 규정이 아닙니다. 다룰 오개념은 다음 3개로 한정하세요: ① AI 결과물의 완성도가 높으면 학생이 이해했다고 확정할 수 있다 ② 수정 과정만 보면 결과물은 평가할 필요가 없다 ③ 콰렌스 심사는 교과 수행평가와 동일하다. 각 항목에 오개념, 왜 확인이 필요한지, 학생에게 물을 열린 확인 질문을 한 문장씩 쓰세요. 배점·통과선·AI 금지 규정·법률·특정 연구 수치를 만들지 마세요. 자료를 업로드하지 않았으므로 공식 근거를 확인했다고 주장하지 말고, 교사가 원문과 수업 상황을 확인해야 할 제안으로 표시하세요. 전체 500자 안팎.";
  const correction = "정정: 콰렌스는 한영고의 학생 탐구 프로그램으로, 열린 Big Question에서 탐구하여 제안·발표하는 맥락입니다. AI 윤리·진위 심사 제도가 아닙니다. 학교교육계획서 원문을 제공하지 않았으므로 공식 세부 내용을 추가하지 마세요. ③의 확인 이유는 학생 탐구 프로그램의 심사와 교과 성취기준 기반 평가를 자동으로 동일시할 수 없다는 점에 한정하세요. 압박 질문·청문회·AI 윤리 심사위원 역할극은 제안하지 마세요. 추가 전략은 항목당 하나만, 한국어로 짧게 쓰세요.";
  const newCorrection = "고등학교 학생의 생성형 AI 활용과 평가. 정정: 콰렌스는 한영고의 학생 탐구 프로그램으로, 열린 Big Question을 탐구·제안하고 발표·질의응답으로 발전시킵니다. AI 윤리 심사나 AI 사용 진위 판별 제도로 설명하지 마세요. 결과물과 과정 모두를 검토하는 교사용 제안을 쓰세요. 학교 문서에 없는 평가 규정·AI 금지 규정·배점·통과 기준은 만들지 마세요. 열린 질문과 교사용 제안을 구별하고 한국어로 작성하세요.";
  const agentPrompt = "고등학교 교사의 수업 준비를 돕습니다. 입력한 수업 주제에 대해 도입 질문 2개, 이해 확인 질문 2개, 정리 질문 1개를 제안하세요. 자료에서 확인되지 않은 사실을 공식 기준처럼 만들지 마세요. 한국어로 간결하게 작성하세요.";
  const P = n => `official-sen-manual/manual-${String(n).padStart(2,"0")}.png`;
  const img = (path,caption) => [path,caption];
  const manual = (n,caption) => img(P(n),`공식 교사용 매뉴얼 ${n}쪽 · ${caption}`);
  const table = (heads,rows) => `<div class="table-wrap"><table><thead><tr>${heads.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  const link = (url,text) => `<a href="${url}" target="_blank" rel="noopener">${text} ↗</a>`;
  const pubRows = [["동아","두클래스"],["미래엔","엠티처"],["천재교육","T셀파"],["금성","티칭허브"],["YBM","Y클라우드"],["비상교육","비바샘"],["지학사","티솔루션"],["아이스크림","아이스크림"]];
  const sourceRows = [
    ["1","한영고 2026 학교교육계획","콰렌스 운영 맥락","학교 내부 자료 · 전문 미배포"],
    ["2","교육부 2025 수행평가 AI 활용 관리 방안 보도자료","정책 방향",link("https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=104984&lev=0&m=020402","원문")],
    ["3","서울특별시교육청 2026 고등학교 학업성적관리 시행지침","규정과 학생 유의사항 예시",link("https://buseo.sen.go.kr/buseo/bu28/user/bbs/BD_selectBbs.do?q_bbsDocNo=20251229134352534&q_bbsSn=1454","원문")],
    ["4","KERIS 운영 학교생활기록부 종합지원포털 2026 과제형 수행평가 Q&A","공개 질의응답",link(QNA,"원문")],
    ["5","Bastani 외, Generative AI Without Guardrails Can Harm Learning","특정 고교 수학 실험",link("https://hamsabastani.github.io/education_llm.pdf","원문")],
    ["6","OECD Digital Education Outlook 2026","수행과 학습의 차이",link("https://www.oecd.org/content/dam/oecd/en/publications/reports/2026/01/oecd-digital-education-outlook-2026_940e0dd8/062a7394-en.pdf","원문")],
    ["7","OECD–EU Empowering Learners for the Age of AI: AI Literacy Framework","AI 리터러시 관점",link("https://www.oecd.org/content/dam/oecd/en/publications/reports/2026/06/empowering-learners-for-the-age-of-ai_2f8315e7/65cd27d4-en.pdf","원문")],
    ["8","개인정보보호위원회 2026 생성형 AI 서비스 이용자 개인정보 보호 가이드","입력·설정·권한 안전",link("https://pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS074&mCode=C020010000&nttId=12084","원문")]
  ];
  const sec = (id,title,lead,tasks,images=[],links=[],extra="",copy=[],success="절차와 주의점을 설명할 수 있습니다.",fail=["현재 계정에서 메뉴가 다르면 공식 매뉴얼의 해당 쪽과 강사 화면을 함께 확인합니다."]) => ({id,title,lead,tasks,images,links,extra,copy,success,fail});
  window.HANYOUNG_GUIDE = [
    sec("G01","시작 / 계정 / 자료","입장 QR과 직접 주소를 함께 사용합니다.",[
      "학교 계정의 로그인 상태를 확인합니다.","SEN·연수 계정 안내 QR과 연수 자료 QR을 열어 둡니다.","발표 HTML과 이 교재를 별도 탭으로 둡니다."
    ],[img("hanyoung/account-qr.png","SEN·연수 계정 안내 QR"),img("hanyoung/padlet-qr.png","한영고 연수 Padlet QR")],[[SEN,"SEN스쿨"],[PADLET,"연수 Padlet"]],"<p class='caution'>QR이 멀리서 열리지 않으면 직접 주소를 사용합니다. 내부 계정 정보의 입력 자체는 이 연수 실습이 아닙니다.</p>",[],"자료와 계정 확인 경로를 열었습니다."),
    sec("G02","SEN스쿨 전체 기능","공식 교사용 매뉴얼의 여섯 장을 기능 지도처럼 봅니다.",[
      "클래스 만들기, 내 클래스 & 꾸러미, 클래스 관리, 우리반 관리, 마이페이지, ToolKit & 출판사 연계를 구별합니다.",
      "홈의 클래스·도구모음·ToolKit 진입 위치를 확인합니다.","발표의 현재 UI 캡처와 공식 매뉴얼 이미지를 구별합니다."
    ],[img("captured/20260928/sen-home-current.png","2026.9.28. 교사 계정 SEN 홈"),manual(2,"공식 매뉴얼 목차")],[[SEN,"SEN스쿨 열기"]],table(["장","주요 내용"],[["1","클래스 만들기"],["2","내 클래스 & 꾸러미"],["3","클래스 관리"],["4","우리반 관리"],["5","마이페이지"],["6","수업지원 ToolKit & 주요 출판사 연계"]]),[],"여섯 장의 기능을 빠짐없이 찾을 수 있습니다."),
    sec("G03","SEN 2026 개편","교사가 쓰는 기능과 학교관리자 범위를 한 화면에서 구별합니다.",[
      "교사: 클래스 개설 간소화, 학생 비밀번호 변경 권한 확대, Classroom 학생 초대, 웨일클래스 학생 명단 동기화, 출판사 8종 연계를 확인합니다.",
      "학교관리자: 조직도 자동 동기화와 담임 배정 절차 간소화를 확인합니다.",
      "학생 초대·비밀번호 변경은 실제 학생 계정에서 시험하지 않습니다."
    ],[manual(2,"개편 기능을 찾아볼 공식 매뉴얼 목차")],[],table(["교사 영역","학교관리자 영역"],[["클래스 개설 · 학생 비밀번호 · LMS/수업도구 · 학생 초대","조직도 자동 동기화 · 담임 배정 절차 간소화"]]),[],"기능의 사용 주체를 정확히 구별합니다."),
    sec("G04","클래스 만들기","안내부터 완료 후 바로가기까지의 공식 절차입니다.",[
      "① 클래스 만들기 안내를 읽고 확인 항목을 체크합니다.",
      "② 직접 만들기 또는 CSV 업로드를 고릅니다. 직접 만들기는 한 클래스를 입력하고, CSV는 여러 클래스를 일괄 개설할 때 사용합니다.",
      "③ 클래스명을 입력합니다. 공식 매뉴얼은 30자까지 허용한다고 안내합니다.",
      "④ 클래스 소개는 선택이며 200자까지 입력할 수 있습니다. 비우면 기본 문구가 설정됩니다.",
      "⑤ 학생을 검색·선택해 배정하거나 개설 뒤 클래스 관리에서 배정합니다.",
      "⑥ 완료 화면에서 새 클래스 홈 또는 학생 관리 바로가기로 이동합니다."
    ],[img("captured/20260928/sen-class-create-01-guidance.png","현행 클래스 만들기 안내"),img("captured/20260928/sen-class-create-02-method.png","현행 만들기 방식"),img("captured/20260928/sen-class-create-03-basic.png","현행 기본정보 입력"),manual(7,"학생 배정"),manual(8,"완료 뒤 바로가기")],[[SEN,"SEN스쿨 열기"]],"<p class='caution'>현재 교사 계정에서는 저장 전까지 확인했습니다. 참가자는 연수 때문에 실제 클래스를 새로 만들 필요가 없습니다.</p>",[],"클래스 만들기 전체 순서를 설명할 수 있습니다."),
    sec("G05","내 클래스 / 자료 / 과제","우리반 현황과 교과 클래스의 자료 구조를 봅니다.",[
      "내 클래스에서 우리반의 학년·반·교사·학생 수와 최신 알림을 확인합니다.",
      "교과 클래스 목록에서 학년도·이름으로 찾고 학생 수·연결 LMS 등을 봅니다.",
      "클래스 홈에서 소개, 학생 관리, LMS, 최근 알림을 확인합니다.",
      "자료는 클래스에 등록된 콘텐츠를 보고, 과제는 기간·제출·미제출 상태를 확인합니다."
    ],[manual(10,"우리반 현황"),manual(11,"교과 클래스 목록"),manual(12,"클래스 홈"),manual(13,"자료"),manual(14,"과제")],[],table(["위치","확인할 것"],[["우리반 현황","학년·반·담임·학생 수·알림"],["교과 클래스 목록","클래스명·담당교사·학생 수·LMS"],["자료","등록 자료와 연결 클래스"],["과제","기한과 제출 현황"]]),[],"내 클래스와 자료·과제의 위치를 찾습니다."),
    sec("G06","수업꾸러미","등록과 설정을 별개 절차로 봅니다.",[
      "꾸러미를 교과·학년·검색어로 찾고 상세 목차를 확인합니다.",
      "선택한 꾸러미를 클래스에 등록합니다.",
      "꾸러미 설정에서 이름·기간·학습맵을 봅니다.",
      "성취기준과 콘텐츠의 위치를 연결해 확인합니다.",
      "콘텐츠 속성과 필요한 보충자료를 검토합니다."
    ],[manual(15,"꾸러미 등록"),manual(16,"꾸러미 설정"),manual(17,"성취기준과 학습맵"),manual(18,"콘텐츠 속성과 보충자료")],[],"<p>공식 매뉴얼은 등록된 꾸러미의 학습맵과 콘텐츠 속성, 보충자료를 순서대로 보여 줍니다. 발표에서는 대표 화면을 빠르게 지나가고 이 절에서 전체 절차를 복습합니다.</p>",[],"수업꾸러미의 등록·설정·검토 단계를 구별합니다."),
    sec("G07","클래스 관리","기본정보, 학생, LMS를 관리하는 장입니다.",[
      "기본정보에서 담당교사·부교사, 클래스 아이콘, 이름, 소개를 확인합니다.",
      "학생 관리에서 배정 학생을 검색하고 일괄·개별 비밀번호 변경 위치를 찾습니다.",
      "학생 상세에서 아이디와 소속 정보를 확인할 수 있습니다.",
      "학생 배정 화면에서 검색·선택·배정을 진행합니다.",
      "LMS 관리에서 연결 대상을 고르고 저장합니다. 매뉴얼은 클래스 생성 15분 이후 연결 가능하다고 안내합니다."
    ],[manual(20,"기본정보 관리"),manual(22,"학생 관리"),manual(23,"비밀번호 변경"),manual(24,"학생 상세"),manual(25,"학생 배정"),manual(26,"LMS 관리")],[],table(["기능","공식 절차 핵심"],[["기본정보","담당교사·부교사·아이콘·클래스명·소개"],["학생 관리","검색·일괄 변경·개별 변경·상세"],["학생 배정","학년·반·아이디·이름 검색 후 선택"],["LMS 관리","대상 선택, 연결, 저장"]]),[],"클래스 관리의 네 영역과 실제 조작 범위를 구별합니다.",["실제 학생정보를 새로 열거나 비밀번호를 바꾸지 않습니다. 공식 매뉴얼 화면으로 절차를 확인합니다."]),
    sec("G08","우리반 관리","우리반 학생정보 불러오기와 학생 관리 위치입니다.",[
      "우리반 학생 목록을 확인하고 이름·아이디 등으로 검색합니다.",
      "학생정보 불러오기 버튼의 위치를 찾습니다.",
      "학생 상세와 비밀번호 변경 절차는 공식 매뉴얼로 확인합니다.",
      "우리반 관리와 교과 클래스의 학생 관리를 구별합니다."
    ],[manual(28,"우리반 학생 관리"),manual(29,"비밀번호 변경")],[],"<p class='caution'>참가자 연수에서는 실제 학생정보를 새로 불러오거나 비밀번호를 변경하지 않습니다.</p>",[],"우리반 관리의 메뉴와 조작 범위를 설명합니다."),
    sec("G09","마이페이지","메인·클래스·우리반 화면과 순서를 개인화합니다.",[
      "메인화면 설정에서 표시할 정보를 고르고 저장합니다.",
      "클래스 설정에서 자료·과제·수업꾸러미 표시를 고릅니다.",
      "우리반 설정에서 알림과 학생관리 영역의 표시를 고릅니다.",
      "클래스 순서 설정에서 원하는 배열로 바꾸고 저장합니다."
    ],[manual(31,"메인화면 설정"),manual(32,"클래스 설정"),manual(33,"우리반 설정"),manual(34,"클래스 순서 설정")],[],"<p>화면 설정과 수업도구 설정은 마이페이지 안에서도 서로 다른 영역입니다. 표시 여부와 실제 자료의 삭제는 구별해야 합니다.</p>",[],"마이페이지에서 네 가지 화면 설정을 찾습니다."),
    sec("G10","수업도구 / ToolKit","수업도구 설정과 수업지원 ToolKit은 기능이 다릅니다.",[
      "수업도구 설정에서 LMS, 수업도구, 교과서 출판사의 세 범주를 구별합니다.",
      "개인 수업도구를 추가할 수 있지만 추가 도구의 SSO 연결은 보장되지 않습니다.",
      "즐겨찾는 수업도구는 최대 3개를 고르고 저장합니다.",
      "ToolKit 버튼에서 열 가지 교사용 도구를 확인합니다."
    ],[img("captured/20260928/sen-tools-settings-top.png","현행 수업도구 설정 상단"),...[["timer","타이머"],["clock","현재시간"],["random","랜덤뽑기"],["wheel","돌림판"],["score","점수판"],["groups","모둠만들기"],["ladder","사다리타기"],["dice","주사위"],["race","뽑기레이스"],["qr","QR 만들기"]].map(([file,name])=>img(`toolkit/20260929/${file}.png`,`${name} · 실제 초기 화면`))],[],table(["ToolKit","기능"],[["타이머","시간 재기·집중"],["현재시간","현재 시각 확인"],["랜덤뽑기","항목 가운데 무작위 선택"],["돌림판","시각적 선택"],["점수판","팀 점수 관리"],["모둠만들기","입력 명단 섞기"],["사다리타기","역할·순서 정하기"],["주사위","간단한 확률 활동"],["뽑기레이스","레이스로 당첨자 뽑기"],["QR 만들기","주소를 QR 코드로"]])+"<p class='caution'>위 열 화면은 실제 초기 화면입니다. 학생 명단이나 개인정보를 넣지 않았습니다. 명단을 쓰는 도구는 교사가 직접 입력하거나 파일로 불러오며, 이 연수 화면에는 실제 학생 정보가 없습니다.</p>",[],"설정 범주와 열 가지 ToolKit을 구별합니다."),
    sec("G11","출판사 연계","출판사 이름과 실제 연결 서비스 이름을 확인합니다.",[
      "마이페이지의 교과서 출판사 설정 영역을 찾습니다.",
      "아래 8개 출판사–서비스 대응을 확인합니다.",
      "최초 연결 시 출판사별 인증 절차가 필요할 수 있습니다."
    ],[img("captured/20260928/sen-publisher-settings.png","현행 교과서 출판사 설정"),manual(41,"공식 8개 출판사 연결")],[],table(["출판사","연결 서비스"],pubRows)+"<p class='caution'>수업도구의 LMS, 웨일클래스 학생 명단 동기화, 교과서 출판사 설정은 서로 같은 기능이 아닙니다.</p>",[],"8개 서비스의 연결 이름을 정확히 말할 수 있습니다."),
    sec("G12","Google Education / Plus","전체 지도만 간결하게 보고 두 Gemini 도구로 이동합니다.",[
      "Workspace의 Docs·Sheets·Slides·Forms·Drive를 확인합니다.",
      "Classroom은 수업과 과제의 공간임을 확인합니다.",
      "Gemini Notebook은 교사가 고른 Source 탐색과 인용 확인에 사용합니다.",
      "Classroom Gemini는 수업자료 초안을 만들고 교사가 수정하는 도구입니다.",
      "Education Plus의 관리·분석·Meet 등 제공 범위는 학교 설정과 계정에 따라 확인합니다."
    ],[img("hanyoung/classroom-gemini.png","Classroom Gemini 실제 도구 메뉴")],[[NOTEBOOK,"Gemini Notebook"],[CLASSROOM,"Classroom Gemini"]],table(["도구","오늘의 역할"],[["Gemini Notebook","자료를 모으고 인용을 눌러 원문과 비교"],["Classroom Gemini","수업 초안 생성 후 교사가 맥락에 맞게 수정"]]),[],"두 도구의 차이를 처음 듣는 교사에게 설명할 수 있습니다."),
    sec("G13","한영고 콰렌스","학교 맥락과 연수의 Big Question을 연결합니다.",[
      "콰렌스 콜로키움은 Big Question 제안에서 제안서·발표·질의응답으로 이어지는 QBL 기반 탐구 프로그램입니다.",
      "1단계는 Big Question과 제안서, 2단계는 발표와 질의응답입니다.",
      "교과 수행평가와 동일한 제도라고 설명하지 않습니다.",
      "연수의 질문 ‘생성형 AI 시대에 학생의 능력을 우리는 무엇으로 평가해야 하는가?’를 읽습니다."
    ],[],[], "<p>한영고 2026 학교교육계획 인쇄 82–83쪽을 강사 시연의 학교 맥락 자료로 사용합니다. 참가자에게는 내부 자료의 <strong>제목과 역할</strong>만 안내하고 학교교육계획서 전체 파일은 배포하지 않습니다.</p>",["Big Question","생성형 AI 시대에 학생의 능력을 우리는 무엇으로 평가해야 하는가?"],"콰렌스의 두 단계와 연수 질문을 구별합니다."),
    sec("G14","Gemini Notebook 이해","강사 시연의 Source·Chat·Studio를 봅니다.",[
      "Notebook은 교사가 직접 선택한 자료를 Source로 모읍니다.",
      "여러 문서를 같은 질문으로 비교하고 답변의 인용을 눌러 원문을 확인합니다.",
      "Studio에서 자료를 인포그래픽·마인드맵 등 다른 형식으로 재구성합니다.",
      "강사의 8-Source Notebook은 시연용입니다. 현장 참가자 조작은 하지 않습니다."
    ],[img("captured/20260928/notebook-studio-overview.png","Notebook의 Source·Chat·Studio 실제 화면"),img("hanyoung/notebook-settings.png","맞춤 채팅 설정 실제 화면")],[[NOTEBOOK,"Gemini Notebook 열기"]],"<p>일반 Gemini와 달리 이 시연에서는 교사가 고른 Source 범위를 중심으로 답변을 살핍니다. 그래도 답변의 정확성이 자동 보장되는 것은 아닙니다.</p>",[],"세 영역과 시연 목적을 설명할 수 있습니다."),
    sec("G15","8개 Source","강사 실제 시연에 쓰인 제목을 모두 적었습니다.",[
      "학교 내부 Source는 제목과 자료 역할만 확인합니다.",
      "공개 Source는 표의 원문 링크를 사용해 직접 확인할 수 있습니다.",
      "Bastani 연구의 대상은 특정 고교 수학 실험이며 전체 교과 일반 원칙으로 확대하지 않습니다."
    ],[],[],table(["번호","실제 Source 제목","역할","원문"],sourceRows)+"<p class='caution'>학교교육계획서 PDF 전체는 참가자 배포물이 아닙니다. 공개 자료만 원문 링크를 제공합니다.</p>",[],"8개 Source 제목과 각자의 역할을 구별합니다."),
    sec("G16","Source → Prompt → Verify → Output","이 흐름은 Notebook 구간에서 사용합니다.",[
      "Source: 질문에 필요한 자료를 고르고 본문이 들어왔는지 확인합니다.",
      "Prompt: 자료의 직접 주장과 교사용 제안을 구별하도록 질문합니다.",
      "Verify: 인용 번호를 클릭해 문서명·원문·표현의 강도를 비교합니다.",
      "Output: 검토 후 필요한 수업자료 형식으로 바꿉니다."
    ],[img("captured/20260928/notebook-answer-citations.png","공개 Q&A 1-Source의 답변과 인용 실제 화면"),img("captured/20260928/notebook-citation-open.png","공개 Q&A 1-Source의 인용을 연 실제 화면")],[[QNA,"공개 Q&A 원문"]],"<p>이 두 화면은 강사의 8-Source Notebook이 아니라 공개 Q&A 1-Source 검증 재현입니다. 답변에 인용이 있다는 사실과 그 인용이 주장을 뒷받침한다는 판단은 별개입니다. 유지·수정·보류를 교사가 결정합니다.</p>",["실제 8-Source 비교 Prompt 발췌",promptEightSource,"연수 후 1-Source Prompt",promptNotebook],"한 문장의 근거를 원문으로 검증하는 순서를 압니다."),
    sec("G17","실제 오류 사례","표현 강화와 잘못된 Source 연결은 다른 오류입니다.",[
      "오류 1: 서울 지침 예시의 ‘채점에서 제외될 수 있음’을 AI가 ‘제외하도록 규정’으로 강화했습니다.",
      "오류 2: Bastani 연구 주장에 한영고 학교교육계획의 다른 부분이 인용으로 연결됐습니다.",
      "인용을 열어 문서명과 조건 표현을 모두 확인합니다."
    ],[img("captured/20260928/notebook-citation-open.png","인용을 열어 Source를 대조하는 실제 UI")],[[sourceRows[2][3].match(/href=\"([^\"]+)/)?.[1]||QNA,"서울 지침 원문"],[QNA,"KERIS Q&A"]],"<p class='caution'>당시 두 오류의 화면은 보존되지 않았습니다. 현재 UI를 과거 오류 화면처럼 합성하지 않았고, 실제 대조 기록의 문장만 제시합니다.</p>",[],"표현 강도 오류와 Source 연결 오류를 구별합니다."),
    sec("G18","Studio","실제 생성된 결과 네 형식을 비교합니다.",[
      "Studio의 아홉 버튼 위치를 실제 화면에서 찾습니다.",
      "인포그래픽에서 ‘자료의 관점’과 ‘교사용 적용 제안’을 구분합니다.",
      "수정 마인드맵의 중심 질문과 가지를 읽습니다.",
      "선택 슬라이드 3·5의 내용과 결과·과정 구분을 봅니다.",
      "퀴즈는 원문과 대조된 1번 정답 C만 사용합니다."
    ],[img("crops/notebook-studio-panel.png","실제 Studio 오른쪽 버튼 영역 확대"),img("hanyoung/studio-infographic.png","실제 인포그래픽 원본"),img("crops/studio-infographic-source-vs-proposal.png","인포그래픽 오른쪽 두 칸의 실제 확대"),img("hanyoung/studio-mindmap-zoom.png","수정 마인드맵"),img("hanyoung/studio-slide-3.png","선택 슬라이드 3"),img("hanyoung/studio-slide-5.png","선택 슬라이드 5"),img("hanyoung/studio-quiz-q1-complete.png","A–D 선택지·정답 C·근거가 보이는 퀴즈 1번 전체 화면"),img("crops/studio-quiz-q1-ab.png","퀴즈 1번 질문과 A·B 확대"),img("crops/studio-quiz-q1-cd.png","퀴즈 1번 정답 C·근거와 D 확대")],[],"<div class='output-pair'><blockquote><strong>자료의 관점</strong><br>AI 제시 근거와 출처의 신뢰성을 검증합니다.</blockquote><blockquote><strong>교사용 적용 제안</strong><br>학생의 AI 활용 기록·출처를 명시하고 비교·검증하도록 지도할 수 있습니다.</blockquote></div><p class='caution'>인포그래픽의 적용 제안을 서울시교육청의 공통 의무 규정처럼 전달하지 않습니다. 퀴즈는 전체 5문항 중 1번만 원문과 대조했습니다.</p>",[],"네 결과 형식의 실제 자산과 검토 지점을 압니다."),
    sec("G19","Notebook 연수 후 따라하기","현장 본편 실습은 아니며 복습용 자율 절차입니다.",[
      "① Gemini Notebook에 접속해 내 계정에서 새 Notebook을 만듭니다.",
      "② Source 추가 → 웹사이트를 선택하고 공개 KERIS Q&A 링크 한 개를 넣습니다.",
      "③ Source 목록뿐 아니라 실제 Q&A 답변 본문이 열리는지 확인합니다.",
      "④ 아래 준비된 Prompt를 Chat에 붙여넣고 답변을 받습니다.",
      "⑤ 인용 하나를 클릭하고 주장 한 문장과 원문을 비교합니다.",
      "⑥ 유지 / 수정 / 보류 중 하나를 고르고 이유를 한 줄로 씁니다."
    ],[img("captured/20260928/notebook-new-button-crop.png","새 Notebook 버튼"),img("captured/20260928/notebook-source-url-filled.png","공개 Q&A URL 입력"),img("captured/20260928/notebook-source-parsed.png","Q&A 본문 확인"),img("captured/20260928/notebook-prompt-filled.png","Prompt 입력"),img("captured/20260928/notebook-citation-open.png","인용과 원문 비교")],[[NOTEBOOK,"Gemini Notebook"],[QNA,"공개 Q&A 원문"]],"<details><summary>Source 추가가 안 될 때</summary><div class='details-body'>강사 화면이나 위 사전 캡처에서 답변 한 문장과 열린 원문을 비교합니다. 강사 공유 Notebook에서 편집하지 않습니다.</div></details>",["연수 후 따라하기 Prompt",promptNotebook],"내 Notebook의 Source 1개와 인용 1개를 검증합니다."),
    sec("G20","Classroom Gemini","Classroom 안의 교사용 생성 도구를 확인합니다.",[
      "Classroom Gemini 메뉴에서 수업계획·퀴즈·기준표·오개념 등 시작점을 봅니다.",
      "본편과 현장 필수 실습에는 ‘일반적인 오개념 바로잡기’를 사용합니다.",
      "수업 계획 개요 작성은 다른 기능의 예시로만 남깁니다."
    ],[img("hanyoung/classroom-gemini.png","Classroom Gemini 실제 메뉴"),img("crops/classroom-tool-grid.png","‘일반적인 오개념 바로잡기’가 보이는 메뉴 확대")],[[CLASSROOM,"Classroom Gemini 열기"]],"<p>생성 결과는 교사용 초안입니다. 학교 고유명사와 학생 맥락은 교사가 확인하고 고칩니다.</p>",[],"Classroom Gemini의 이번 연수 기능을 찾습니다."),
    sec("G21","오개념 바로잡기 실습","이번 연수의 유일한 현장 필수 참가자 조작입니다.",[
      "① Classroom Gemini를 열고 ‘일반적인 오개념 바로잡기’를 선택합니다.",
      "② 학년은 ‘고등학교 1’, 주제는 본인의 수업 주제 또는 예시를 넣습니다.",
      "③ 생성 결과에서 학교·교과 맥락과 어긋나는 표현 한 곳을 찾습니다.",
      "④ 교사가 그 문장을 학생에게 맞게 고칩니다.",
      "⑤ 수정 전후 한 문장과 그 이유를 짝과 공유합니다."
    ],[img("crops/classroom-tool-grid.png","실제 도구 메뉴 확대"),img("crops/classroom-input-form.png","실제 입력 양식의 빈 상태"),img("crops/classroom-first-result.png","과거 첫 결과 중 보존된 두 항목"),img("captured/20260929/classroom/new-correction-form.png","2026.9.29 새 정정 입력 화면 확대: 한 줄 입력창에는 앞부분만 보임"),img("captured/20260929/classroom/new-result-1-zoom.png","2026.9.29 새 결과: 열린 질문과 교사용 제안이 구분된 첫 항목"),img("captured/20260929/classroom/new-result-process-zoom.png","2026.9.29 새 결과: 학생의 핵심 논리와 수정 과정을 살피는 제안"),img("captured/20260929/classroom/new-result-3-full.png","2026.9.29 새 결과: 발표와 질의응답 관련 후반 항목")],[[CLASSROOM,"실습 도구 열기"]],"<p>과거 첫 결과 캡처에는 앞의 두 항목만 보이며, 콰렌스 오류와 당시 정정 전용 화면은 보존되지 않았습니다. 2026년 9월 29일 같은 기능으로 새 검증을 실행하고 실제 화면을 다시 캡처했습니다. 새 요청에는 콰렌스를 학생 탐구 프로그램으로 설명하고 AI 윤리·진위 심사와 구별하도록 적었습니다. 새 결과에는 Big Question과 발표·질의응답, 학생을 위한 열린 질문과 교사용 안내 및 제안이 보입니다. 다만 영어 소제목이 남고 활동·평가에 관한 제안은 학교의 공식 규정이 아니므로 교사가 원문과 수업 맥락을 확인해 수정해야 합니다. 새 검증은 과거 대화 이력으로 취급하지 않습니다.</p>",["과거 첫 생성 입력 예시",promptClassroom,"과거 정정 기록 문구",correction,"2026.9.29 새 검증 입력",newCorrection],"도구 진입부터 한 문장 수정까지 완료했습니다.",["접속·권한이 없으면 강사 실제 화면과 이 교재의 결과를 비교해 수정 문장 한 개를 적습니다."]),
    sec("G22","SenGPT","모델·사용량·에이전트·예약의 위치를 봅니다.",[
      "SEN스쿨의 도구모음에서 SenGPT로 진입합니다.",
      "모델 선택 메뉴에서 작업에 맞는 모델을 고릅니다.",
      "사이드바의 개인 사용량과 초기화 시점을 확인합니다.",
      "이번 강사 테스트는 외부 파일과 민감자료를 사용하지 않았습니다."
    ],[img("sengpt/20260929/home-full.png","실제 SenGPT 전체 첫 화면"),img("sengpt/20260929/models-overview.png","실제 모델 선택 메뉴"),img("sengpt/20260929/models-google.png","Google 모델 실제 메뉴"),img("sengpt/20260929/models-openai-1.png","OpenAI 모델 실제 메뉴"),img("sengpt/20260929/usage-tooltip.png","지원단 강사 계정의 0원/60,000원과 초기화 표시"),...[["official-training-1.png","연수·성장"],["official-teaching-1.png","수업·평가·연구"],["official-student-1.png","학생지원·생활"],["official-safety-1.png","안전·보호"],["official-contract-1.png","계약·인사"],["official-civil-1.png","민원·기관"],["official-award-1.png","공모전 당선작"]].map(([file,name])=>img(`sengpt/20260929/${file}`,`서울시교육청 에이전트 · ${name} 실제 목록`))],[[SENGPT,"SenGPT 열기"]],"<p>‘서울시교육청 에이전트’는 분야별 제공 목록이고 ‘나만의 에이전트’는 사용자가 구성한 목록입니다. 강사 화면의 60,000원은 SEN스쿨 지원단 계정에 표시된 값입니다. 일반 계정은 사용자 안내 기준 30,000원이며, 참가자는 자신의 화면에서 제공량과 초기화 시점을 확인합니다. 에이전트 설명만으로 공식 근거를 자동 충족한다고 가정하지 말고 원문을 확인합니다.</p>",[],"SenGPT의 기본 화면과 두 종류의 에이전트 목록을 구별합니다."),
    sec("G23","나만의 에이전트","강사가 실제 생성한 안전한 테스트 예시입니다.",[
      "나만의 에이전트 → 에이전트 만들기를 엽니다.",
      "유형은 대화형, 모델은 Gemini 3.5 Flash Lite를 선택했습니다.",
      "이름: ‘한영고 연수 테스트 | 수업 질문 도우미’. 설명은 도입 질문 2개·확인 질문 2개·정리 질문 1개를 제안하는 교사용 도우미입니다.",
      "Prompt 입력창에 역할이나 목적을 한두 줄로 적고, 오른쪽 요술봉의 Prompt 작성 도움 기능을 사용할 수 있습니다.",
      "요술봉이 제안한 초안은 역할·출력 형식·자료 범위·제약을 교사가 확인하고 고친 뒤 확정합니다.",
      "아래 지시문과 대화 시작 가이드 1개를 넣었습니다.",
      "외부 파일을 올리지 않고, 필요 없는 도구를 끈 뒤 만들기를 눌렀습니다.",
      "‘에이전트가 생성되었습니다’ 알림과 내 에이전트 목록을 확인했습니다."
    ],[img("sengpt/20260929/agent-list-1.png","완성된 나만의 에이전트 목록"),img("sengpt/20260929/agent-completed-form.png","테스트 에이전트의 유형·모델·이름·설명·Prompt"),img("sengpt/20260929/agent-prompt.png","실제 Prompt 입력창과 오른쪽 요술봉 버튼 위치"),img("sengpt/20260929/agent-completed-guide.png","실제 시작 가이드와 파일 영역"),img("sengpt/20260929/agent-completed-tools-top.png","실제 연결 도구 선택 영역"),img("sengpt/20260929/agent-completed-tools-middle.png","실제 바로 쓸 수 있는 도구 영역")],[[SENGPT,"SenGPT 열기"],["https://gov.wrks.ai/guides/agent/index.html","SenGPT 에이전트 이용 가이드"]],table(["입력 항목","실제 테스트"],[["유형","대화형"],["모델","Gemini 3.5 Flash Lite"],["이름","한영고 연수 테스트 | 수업 질문 도우미"],["대화 시작 가이드","고등학교 1학년 수업에서 생성형 AI 활용을 주제로 질문을 제안해줘"],["도구","외부 도구 없음, 기본 내부 도구 해제"]]),["에이전트 Prompt",agentPrompt],"필수 입력 항목과 안전한 도구 선택을 설명합니다."),
    sec("G24","예약","테스트 예약 저장과 비활성화까지 실제로 확인했습니다.",[
      "대화 예약 추가에서 생성한 테스트 에이전트를 선택합니다.",
      "일회성으로 2026-10-05 09:00(서울 시간)에 예약했습니다.",
      "요청은 ‘오늘 수업 준비에서 확인할 항목 3개를 알려줘.’였습니다.",
      "결과 이메일 수신은 OFF로 두고 저장했습니다.",
      "목록에 ‘수업 준비 점검’이 표시된 것을 확인하고 스위치를 OFF로 바꿨습니다.",
      "‘스케줄이 일시정지되었습니다’ 알림과 일시정지 상태를 확인했습니다."
    ],[img("sengpt/20260929/schedule-paused-edit.png","실제 수업 준비 점검 예약의 대상·날짜·시간·반복·요청·이메일 OFF"),img("sengpt/20260929/schedule-paused-list.png","저장된 수업 준비 점검 예약의 일시정지 상태"),img("sengpt/20260929/schedule-email-on-example.png","별도 기존 예약에서 이메일 수신을 켠 경우의 실제 입력 영역")],[[SENGPT,"SenGPT 열기"],["https://gov.wrks.ai/guides/schedule/schedule-guide.html","SenGPT 대화 예약 이용 가이드"]],"<p class='caution'>‘수업 준비 점검’ 테스트 예약은 현재 일시정지 상태입니다. 이메일 ON 화면은 별도 기존 예약의 설정 예이며 테스트 예약의 설정이 아닙니다. 참가자가 따라 할 경우 자신의 예약의 실행·반복·메일 상태를 끝나기 전에 다시 확인합니다.</p>",["테스트 예약 요청","오늘 수업 준비에서 확인할 항목 3개를 알려줘."],"예약 입력·저장·목록 확인·일시정지의 순서를 설명합니다."),
    sec("G25","문제 해결","접속과 근거 확인이 막힐 때의 경로입니다.",[
      "SEN 메뉴가 다르면 계정 권한과 공식 매뉴얼의 해당 쪽을 확인합니다.",
      "Notebook Source 등록만 되고 본문이 비면 정상 Source로 간주하지 않습니다.",
      "Classroom Gemini가 보이지 않으면 계정·관리자 설정을 확인하고 강사 화면으로 따라갑니다.",
      "SenGPT 예약은 이메일 수신 상태와 반복 주기를 저장 전에 다시 봅니다.",
      "수업 시간 부족 시 SenGPT 참가자 조작은 생략하고 Classroom 필수 실습을 마칩니다."
    ],[],[],"<p>실제 UI가 바뀌면 화면의 현재 명칭을 먼저 확인하고, 이 교재의 공식 매뉴얼 쪽수와 기능 목적을 대조합니다.</p>",[],"문제가 생겼을 때 다음 확인 경로를 압니다."),
    sec("G26","링크 / Prompt / 자료","연수 후 다시 실행할 때 필요한 공개 자료와 문구입니다.",[
      "공개 Q&A와 8 Source의 원문 링크를 열어봅니다.",
      "Notebook 자율 실습 Prompt, Classroom 생성·정정 Prompt, SenGPT 테스트 Prompt를 복사합니다.",
      "학교교육계획서는 제목과 자료 역할만 이 교재에 남기고 전체 파일은 포함하지 않습니다."
    ],[],[[SEN,"SEN스쿨"],[NOTEBOOK,"Gemini Notebook"],[CLASSROOM,"Classroom Gemini"],[SENGPT,"SenGPT"],[QNA,"KERIS Q&A"],[PADLET,"연수 Padlet"]],table(["자료","원문"],sourceRows.filter(r=>r[0]!=="1").map(r=>[r[1],r[3]])),["Notebook 자율 실습",promptNotebook,"Classroom 첫 생성",promptClassroom,"Classroom 정정",correction,"SenGPT 에이전트",agentPrompt],"공개 링크와 필요한 문구를 다시 찾을 수 있습니다.")
  ];
})();

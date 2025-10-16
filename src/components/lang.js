import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
    kr: {
        translation: {},
    },
    en: {
        translation: {
            /* 서비스 명칭 */
            Splash: 'Splash',
            /* 일반 발화 */
            로그인: 'Login',
            로그아웃: 'Logout',
            회원가입: 'Register',
            회원: 'Member',
            계정: 'Account',
            인증: 'Auth',
            설정: 'Setting',
            예: 'Yes',
            아니오: 'No',
            확인: 'Ok',
            취소: 'Cancel',
            작성: 'Write',
            수정: 'Edit',
            생성: 'Create',
            시작: 'Initial',
            진행: 'Progress',
            완료: 'Complete',
            오류: 'Error',
            리스트: 'List',
            페이지: 'Pages',
            /* 페이지 별 */
            /* 로그인 : /auth/login */
            '계정으로 로그인': 'Sign in on the Account',
            이메일: 'Email',
            비밀번호: 'Password',
            '올바른 메일주소 형식으로 입력해주세요.': 'Must be a valid email',
            '아이디를 입력해주세요.': 'Email is required',
            '비밀번호를 입력해주세요.': 'Password is required',
            '카카오 로그인': 'Login with Kakao',
            회원가입: 'Create new account',
            /* 로그인 : /auth/login */
            '계정 회원가입': 'Register on the Account',
            이름: 'Name',
            '휴대폰 번호': 'Phone Number',
            인증코드: 'Verification Code',
            '비밀번호 확인': 'Password Confimation',
            '동일한 비밀번호를 입력해주세요.': 'Please enter the same password',
            '이름을 입력해주세요.': 'Name is required',
            '휴대폰 번호를 입력해주세요.': 'Phone Number is required',
            '회원가입을 위해 약관에 동의해주세요.': 'This field must be checked',
            '아이디(메일주소)': 'ID(Email Address)',
            '← 로그인 바로가기': '← Having an account',
            '서비스 이용약관 동의': 'Accept ',
            이용약관: 'Terms and Conditions',
        },
    },
}

i18n.use(initReactI18next).init({
    resources,
    lng: 'kr',
    fallbackLng: 'kr',
    interpolation: {
        escapeValue: false,
    },
})

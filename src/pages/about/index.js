import React from 'react';
import { Box, Container, Typography, Card, CardContent, Divider, Grid } from '@mui/material';
import SubLayout from '@layouts/sub';
// import { MainLayout } from '../components/layout/main-layout'; // 프로젝트의 레이아웃 컴포넌트를 import 하세요.

const AboutPage = () => {
  return (
    <Box sx={{
      // 1. Layout: 페이지 전체 배경색 적용
      backgroundColor: 'background.default', // 가이드라인의 #F8F9FA
      py: { xs: 4, md: 8 }, // 섹션 상하 여백
    }}>
      <Container maxWidth="lg">
        {/* 페이지 메인 타이틀 */}
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            // 2. Typography: Heading 2 스타일 적용
            fontWeight: 700,
            fontSize: { xs: '32px', md: '36px' },
            color: 'text.primary', // #212529
            textAlign: 'center',
            mb: 2,
          }}
        >
          About Our Project
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}
        >
          Smart Survey는 인공지능 기술을 통해 건축 설계의 새로운 미래를 제시합니다.
        </Typography>

        {/* --- 연구 소개 섹션 --- */}
        <Card sx={{
          // 3. Component (Card): 가이드라인에 맞춘 카드 스타일
          borderRadius: '16px',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.05)',
          mb: { xs: 6, md: 8 }, // 섹션 간 간격
        }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 700, fontSize: '24px', color: 'text.primary', mb: 1 }}>
              연구소개
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h6" component="p" sx={{ fontWeight: 500, color: 'secondary.main', mb: 3, lineHeight: 1.6 }}>
              "인공지능 기반의 건축 설계 자동화 기술 개발 연구는 건축 설계 기술에 있어 인공지능을 도입하여 각 분야에서 적극적으로 활용할 수 있는 자료를 제공함으로써, 향후 건축 설계 기술 개발에 새로운 방향을 제시하고자 합니다."
            </Typography>
            <Box
              component="img"
              src="https://cdn.imweb.me/thumbnail/20221003/45ef014b5961a.jpg"
              alt="Research Introduction Image"
              sx={{ width: '100%', borderRadius: '12px', mb: 3 }}
            />
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
              저희 경북대학교 건축학과에서 진행하고 있는 본 연구에서는 일종의 만족도 조사로 행해지고 있는 실제 이용자들의 거주 후 평가인 POE(Post Occupancy Evaluation)을 응용하여 근린생활시설을 이용하는 실제 이용자들에게 설문조사를 진행하고 있습니다. 또한, 본 연구는 중요도-만족도 조사로 확대하여, 건물의 특성과 건물을 구성하는 실들의 특징을 면밀히 분석하여 지표를 구성하고자 합니다.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
              새로운 기술 개발에 앞서 많은 이용자들의 설문 조사 결과가 필요함에 따라, 저희는 본 사이트를 개설하고 관리하게 되었습니다. 본 연구의 목표에 도달하기 위해 끊임없이 노력하겠습니다. 감사합니다.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                component="img"
                src="https://cdn.imweb.me/thumbnail/20221003/6303d6f7a1ed2.jpg"
                alt="Kyungpook National University Logo"
                sx={{ maxWidth: '100%', height: 'auto', maxHeight: '60px' }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* --- POE 섹션 --- */}
        <Card sx={{ borderRadius: '16px', boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.05)', mb: { xs: 6, md: 8 } }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 700, fontSize: '24px', color: 'text.primary', mb: 1 }}>
              POE (Post Occupancy Evaluation)
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h6" component="p" sx={{ fontWeight: 500, color: 'secondary.main', mb: 3, lineHeight: 1.6 }}>
              "POE는 실제 이용자들이 건물을 이용한 후에 시행하는 평가로서 본 연구에서는 POE평가를 데이터 구축의 중요한 지표로 판단하고 있습니다."
            </Typography>
            <Box
              component="img"
              src="https://cdn.imweb.me/thumbnail/20221005/75e202a0ff46a.jpg"
              alt="POE Chart Image"
              sx={{ width: '100%', borderRadius: '12px', mb: 3 }}
            />
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
              POE는 나이, 직업 등의 이용자 특성과 건물의 위치, 규모 및 형태, 구비된 설비나 시설 등에 따라서 각 개인의 중요도-만족도는 다르게 나타날 수 있습니다. 하지만 접근성을 개선한 온라인 사이트를 활용한 설문조사를 통해 더욱 다양한 많은 사람들에게서 응답을 받아 빅데이터를 구축하는데에 의의가 있는 설문방법입니다.
            </Typography>
             <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              본 설문에서는 중요도-만족도를 1점~7점 리커트척도를 사용하여 해당하는 정도를 체크하여 설문에 응답할 수 있으며, 설문조사 응답결과를 실시간으로 받아 누적되는 결과에 따라 변화하는 분석결과를 시각화하여 보여주어 건축 설계와 관련된 다양한 분야에서 새로운 관점을 제공하고자 합니다.
            </Typography>
          </CardContent>
        </Card>

        {/* --- 오시는 길 섹션 --- */}
        <Card sx={{ borderRadius: '16px', boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.05)' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 700, fontSize: '24px', color: 'text.primary', mb: 1 }}>
              오시는 길
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              본 연구는 경북대학교 건축학과에서 진행되는 연구 과제입니다.
            </Typography>
            {/* 지도 컴포넌트 영역 */}
            <Box sx={{
              height: '400px',
              border: '1px solid #DEE2E6', // Line/Border
              borderRadius: '12px',
              backgroundColor: '#F8F9FA', // Background
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {/* 실제 지도 라이브러리(예: react-naver-maps)를 여기에 통합하세요. */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3232.894377033481!2d128.6114353152642!3d35.8759979801501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3565e1a27a552a1d%3A0x3345914a3a3a411a!2z6rK967aB64yA7ZWZ6교!5e0!3m2!1sko!2skr!4v1678886400000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </Box>
          </CardContent>
        </Card>

      </Container>
    </Box>
  );
};

AboutPage.getLayout = (page) => <SubLayout>{page}</SubLayout>
export default AboutPage;
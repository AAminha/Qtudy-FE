import QuizCheckForm from '@/components/Form/QuizCheckForm';
import Scrollbar from '@/components/Scrollbar/Scrollbar';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import CategorySidebar from '@/containers/CategoryDetailPage/CategorySidebar';
import TopButtonBar from '@/containers/CategoryDetailPage/TopButtonBar';
import { useGetCategoryQuizItem } from '@/hooks/useGetQuiz';
import useRedirect from '@/hooks/useRedirect';
import authState from '@/recoils/atoms/authState';
import { CategoryQuizItem } from '@/types/quiz.type';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

function CategoryQuizDetailPage() {
  const redirect = useRedirect();
  const isAuthenticated = useRecoilValue(authState);
  const [params] = useSearchParams();
  const categoryId = Number(params.get('categoryId'));
  const quizId = Number(params.get('id'));
  const { data: quizData, error } = useGetCategoryQuizItem(quizId);
  const [currentQuiz, setCurrentQuiz] = useState<CategoryQuizItem>();
  const [isWriter, setIsWriter] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (quizData) {
      setCurrentQuiz(quizData.response);
      setIsWriter(quizData.isWriter);
    }
  }, [quizData]);

  useEffect(() => {
    if (isNaN(categoryId) || isNaN(quizId) || error)
      redirect('/management/category');
  }, [categoryId, quizId, error, redirect]);

  return (
    <ContentWrapper>
      <StyledContent $isWriter={isWriter}>
        {isAuthenticated && (
          <TopButtonBar
            handleReturnToList={() => {
              navigate(
                `/management/category?type=quiz&categoryId=${categoryId}`
              );
            }}
            handleEdit={() => {
              navigate(
                `/management/category/edit/quiz?categoryId=${categoryId}&id=${quizId}`,
                {
                  state: { quizData: currentQuiz },
                }
              );
            }}
          />
        )}
        <StyledInnerContainer>
          {currentQuiz && <QuizCheckForm quiz={currentQuiz} />}
        </StyledInnerContainer>
      </StyledContent>
      <CategorySidebar
        isAuthenticated={isAuthenticated}
        contentType="QUIZ"
        contentQuiz={currentQuiz}
        categoryId={categoryId}
        contentId={currentQuiz ? currentQuiz.problemId : -1}
      />
    </ContentWrapper>
  );
}

export default CategoryQuizDetailPage;

const StyledContent = styled.div<{ $isWriter: boolean }>`
  flex: 1;
  padding: 0 20px 40px 40px;
  padding-top: ${({ $isWriter }) => ($isWriter ? '24px' : '40px')};

  display: flex;
  flex-direction: column;
`;

const StyledInnerContainer = styled.div`
  overflow-y: scroll;
  ${Scrollbar}
`;

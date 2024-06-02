import { editQuizToCategory } from '@/apis/quizCategoryApi';
import QuizGenerationForm from '@/components/Form/QuizGenerationForm';
import Scrollbar from '@/components/Scrollbar/Scrollbar';
import Sidebar from '@/components/Sidebar/Sidebar';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import TopButtonBar from '@/containers/CategoryDetailPage/TopButtonBar';
import { CategoryQuizItem, QuizType } from '@/types/quiz.type';
import { QUIZ_TYPE } from '@/utils/convertToRequestData';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

const initialQuizContent: QuizType = {
  problemName: '',
  problemAnswer: '-1',
  problemCommentary: '',
  problemChoices: [''],
};

function CategoryQuizEditPage() {
  const [params] = useSearchParams();
  const categoryId = Number(params.get('categoryId'));
  const quizId = Number(params.get('id'));
  const [quizContent, setQuizContent] = useState<QuizType>(initialQuizContent);
  const [quizType, setQuizType] = useState('객관식');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { state } = location;

    if (state.quizData) {
      const quiz = state.quizData as CategoryQuizItem;
      setQuizType(
        Object.entries(QUIZ_TYPE).find(
          ([_, value]) => value === quiz.problemType
        )?.[0] ?? '객관식'
      );
      setQuizContent({
        problemName: quiz.problemName,
        problemAnswer: quiz.problemAnswer ?? '',
        problemCommentary: quiz.problemCommentary,
        problemChoices: quiz.problemChoices ?? [],
      });
    }
  }, []);

  const handleCancel = () => {
    navigate(`/management/category/quiz?categoryId=${categoryId}&id=${quizId}`);
  };

  const handleEdit = async () => {
    try {
      await editQuizToCategory(quizId, quizContent);
      handleCancel();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ContentWrapper>
      <StyledContent>
        <TopButtonBar
          isEdit
          handleCancel={handleCancel}
          handleComplete={handleEdit}
        />
        <StyledInnerContainer>
          <QuizGenerationForm
            quizType={quizType}
            quizContent={quizContent}
            setQuizContent={setQuizContent}
          />
        </StyledInnerContainer>
      </StyledContent>
      <Sidebar />
    </ContentWrapper>
  );
}

export default CategoryQuizEditPage;

const StyledContent = styled.div`
  flex: 1;
  padding: 24px 20px 24px 40px;
`;

const StyledInnerContainer = styled.div`
  height: 100%;

  overflow-y: scroll;
  ${Scrollbar}
`;

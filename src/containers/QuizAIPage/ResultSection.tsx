import PDFDownloadButton from '@/components/Button/PDFDownloadButton';
import SaveToCategoryButton from '@/components/Button/SaveToCategoryButton';
import ShareLinkButton from '@/components/Button/ShareLinkButton';
import QuizCheckForm from '@/components/Form/QuizCheckForm';
import SaveToCategoryModal from '@/components/Modal/SaveToCategoryModal';
import NumberPanel from '@/components/NumberPanel/NumberPanel';
import Scrollbar from '@/components/Scrollbar/Scrollbar';
import DefaultSidebar from '@/components/Sidebar/DefaultSidebar';
import { useGetAIQuizFile } from '@/hooks/useGetQuiz';
import useRedirect from '@/hooks/useRedirect';
import authState from '@/recoils/atoms/authState';
import { ProblemsOfAIQuizFile } from '@/types/quiz.type';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

function ResultSection() {
  const [searchParams] = useSearchParams();
  const fileId = Number(searchParams.get('id'));
  const isAuthenticated = useRecoilValue(authState);
  const [showModal, setShowModal] = useState(false);
  const [quizNum, setQuizNum] = useState(1);
  const [quizList, setQuizList] = useState<ProblemsOfAIQuizFile[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<ProblemsOfAIQuizFile>();
  const [isWriter, setIsWriter] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const redirect = useRedirect();
  const { data: fetchedQuizList, isLoading, error } = useGetAIQuizFile(fileId);

  useEffect(() => {
    if (isNaN(fileId) || error) {
      redirect('/quiz/ai');
    }
  }, [fileId, error, redirect]);

  useEffect(() => {
    if (!isInitialized && fetchedQuizList) {
      setQuizList(fetchedQuizList.problems);
      setCurrentQuiz(fetchedQuizList.problems[0]);
      setIsWriter(fetchedQuizList.isWriter);
      setIsInitialized(true);
    }
  }, [fetchedQuizList]);

  useEffect(() => {
    if (!fileId) return;
    setCurrentQuiz(quizList[quizNum - 1]);
  }, [quizNum, quizList, fileId]);

  if (isLoading) return <div>Loading...</div>;

  if (currentQuiz)
    return (
      <>
        <StyledContent>
          <StyledInnerContent>
            <QuizCheckForm quiz={currentQuiz} />
          </StyledInnerContent>
        </StyledContent>
        <DefaultSidebar>
          <SidebarContentContainer>
            <ContentInnerContainer>
              <NumberPanel
                numOfQuiz={quizList.length}
                questionNum={quizNum}
                setQuestionNum={setQuizNum}
              />
              <ShareLinkButton link={window.location.href} />
              {isWriter && (
                <PDFButtonWrapper>
                  <PDFDownloadButton
                    pdfType="QUIZ"
                    variant={1}
                    type="AI"
                    fileId={fileId}
                  />
                  <PDFDownloadButton
                    pdfType="ANSWER"
                    variant={1}
                    type="AI"
                    fileId={fileId}
                  />
                </PDFButtonWrapper>
              )}
            </ContentInnerContainer>
            <SaveToCategoryButton
              disabled={!isAuthenticated}
              onClick={() => setShowModal(true)}
            />
          </SidebarContentContainer>
        </DefaultSidebar>
        {showModal && (
          <SaveToCategoryModal
            categoryType="QUIZ"
            contentId={currentQuiz.aiGeneratedProblemId}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
}

export default ResultSection;

const StyledContent = styled.div`
  flex: 1;
  height: 100%;

  display: flex;
  flex-direction: column;
  padding: 40px;
  padding-right: 20px;
`;

const StyledInnerContent = styled.div`
  height: 100%;

  overflow-y: scroll;
  ${Scrollbar}
`;

const SidebarContentContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
`;

const ContentInnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
`;

const PDFButtonWrapper = styled.div`
  display: flex;
  gap: 12px;
`;

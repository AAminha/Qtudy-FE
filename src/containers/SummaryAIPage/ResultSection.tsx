import CopySummaryButton from '@/components/Button/CopySummaryButton';
import PDFDownloadButton from '@/components/Button/PDFDownloadButton';
import SaveToCategoryButton from '@/components/Button/SaveToCategoryButton';
import ShareLinkButton from '@/components/Button/ShareLinkButton';
import SummaryCheckForm from '@/components/Form/SummaryCheckForm';
import SaveToCategoryModal from '@/components/Modal/SaveToCategoryModal';
import DefaultSidebar from '@/components/Sidebar/DefaultSidebar';
import { useGetAISummaryFile } from '@/hooks/useGetSummary';
import useRedirect from '@/hooks/useRedirect';
import authState from '@/recoils/atoms/authState';
import { SummaryType } from '@/types/summary.type';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

function ResultSection() {
  const [searchParams] = useSearchParams();
  const fileId = Number(searchParams.get('id'));
  const isAuthenticated = useRecoilValue(authState);
  const [showModal, setShowModal] = useState(false);
  const [summary, setSummary] = useState<SummaryType>();
  const [isWriter, setIsWriter] = useState(false);
  const redirect = useRedirect();
  const {
    data: fetchedSummaryList,
    isLoading,
    error,
  } = useGetAISummaryFile(fileId);

  useEffect(() => {
    if (isNaN(fileId) || error) {
      redirect('/summary/ai');
    }
  }, [fileId, error, redirect]);

  useEffect(() => {
    if (fetchedSummaryList) {
      setSummary(fetchedSummaryList.response);
      setIsWriter(fetchedSummaryList.isWriter);
    }
  }, [fetchedSummaryList]);

  if (isLoading) return <div>Loading...</div>;

  if (summary)
    return (
      <>
        <StyledContent>
          <SummaryCheckForm summary={summary} />
        </StyledContent>
        <DefaultSidebar>
          <SidebarContentContainer>
            <StyledButtonContainer>
              <CopySummaryButton text={summary.summaryContent} />
              <ShareLinkButton link={window.location.href} />
              {isAuthenticated && isWriter && (
                <PDFDownloadButton
                  variant={1}
                  pdfType="SUMMARY"
                  type="AI"
                  fileId={fileId}
                />
              )}
            </StyledButtonContainer>
            <SaveToCategoryButton
              disabled={!isAuthenticated}
              onClick={() => setShowModal(true)}
            />
          </SidebarContentContainer>
        </DefaultSidebar>
        {showModal && (
          <SaveToCategoryModal
            categoryType="SUMMARY"
            contentId={summary.aiGeneratedSummaryId}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
}

export default ResultSection;

const StyledContent = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  padding: 40px;
  padding-right: 20px;
`;

const SidebarContentContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 30px;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

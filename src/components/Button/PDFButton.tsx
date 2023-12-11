import styled from 'styled-components';
import FileApi from '../../api/FileApi';
import { ReactComponent as PDFIcon } from '../../assets/icons/pdf.svg';
import Typography from '../Typography';

type Props = {
  label: string;
  fileId: number;
  pdfType: 'PROBLEM' | 'ANSWER' | 'SUMMARY';
  variant?: 1 | 2;
  type: 'ai' | 'user' | 'category';
};

PDFButton.defaultProps = {
  variant: 1,
};

function PDFButton({ label, variant, fileId, pdfType, type }: Props) {
  const handleClickDownload = async () => {
    let data;
    if (type === 'ai') data = await FileApi.downloadAIFile(fileId, pdfType);
    if (type === 'user' && pdfType === 'SUMMARY') data = await FileApi.downloadUserSummaryFile(fileId);
    if (type === 'category' && pdfType === 'PROBLEM') data = await FileApi.downloadCategoryProblemFile(fileId);
    if (type === 'category' && pdfType === 'ANSWER') data = await FileApi.downloadCategoryAnswerFile(fileId);
    if (type === 'category' && pdfType === 'SUMMARY') data = await FileApi.downloadCategorySummaryFile(fileId);

    window.location.href = data.fileUrl;
  };

  if (variant === 1)
    return (
      <Wrapper onClick={handleClickDownload}>
        <IconWrapper>
          <PDFIcon />
          <Label>{label}</Label>
        </IconWrapper>
        <Typography variant="caption3" color="grayScale03">
          PDF 다운
        </Typography>
      </Wrapper>
    );

  if (variant === 2)
    return (
      <Wrapper onClick={handleClickDownload}>
        <PDFIcon />
        <Typography variant="caption3" color="grayScale03">
          {label} PDF
        </Typography>
      </Wrapper>
    );
}

const Wrapper = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  cursor: pointer;
`;

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;
`;

const Label = styled.div`
  color: ${({ theme }) => theme.colors.mainMintDark};
  font-family: Noto Sans KR;
  font-size: 8px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export default PDFButton;

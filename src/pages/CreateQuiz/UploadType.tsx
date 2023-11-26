import styled from 'styled-components';
import { ReactComponent as UploadIcon } from '../../assets/icons/icon-upload.svg';
import { ReactComponent as ExitIcon } from '../../assets/icons/icon-exit.svg';
import Typography from '../../components/Typography';
import { UploadedFileType } from '../../types';

interface UploadTypeProps {
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  pdfFile: UploadedFileType | null;
  imageFiles: UploadedFileType[];
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUploadButtonClick: () => void;
  handleDelete: (index: number | null) => void;
}

function UploadType({
  inputRef,
  pdfFile,
  imageFiles,
  handleFileUpload,
  handleUploadButtonClick,
  handleDelete,
}: UploadTypeProps) {
  if (!pdfFile && imageFiles.length <= 0) {
    return (
      <Container onClick={handleUploadButtonClick}>
        <input
          style={{ display: 'none' }}
          type="file"
          accept="image/*, .pdf"
          multiple
          ref={inputRef}
          onChange={handleFileUpload}
        />
        <UploadIcon />
        <Text>
          <Typography variant="subtitle" color="grayScale02">
            파일을 업로드해주세요
          </Typography>
          <Typography variant="caption3" color="grayScale02">
            (.pdf, .txt, .jpg, .png)
          </Typography>
        </Text>
      </Container>
    );
  }

  return (
    <PreviewContainer>
      {pdfFile !== null && (
        <Preview>
          <ExitIcon className="exit" onClick={() => handleDelete(null)} />
          <object data={URL.createObjectURL(pdfFile.file)} type="application/pdf" width="400" height="300">
            PDF 미리보기를 지원하지 않는 브라우저입니다.
          </object>
        </Preview>
      )}
      {imageFiles.length > 0 &&
        imageFiles.map((image, index) => (
          <Preview key={image.name}>
            <ExitIcon className="exit" onClick={() => handleDelete(index)} />
            <img src={URL.createObjectURL(image.file)} alt="이미지 미리보기" />
          </Preview>
        ))}
    </PreviewContainer>
  );
}

export default UploadType;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  cursor: pointer;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  width: 100%;
  height: max-content;
  padding: 16px;
  gap: 16px;

  .exit {
    position: absolute;
    z-index: 1;
    top: 16px;
    right: 16px;
    cursor: pointer;
  }
`;

const Preview = styled.div`
  width: 245px;
  height: 138px;
  background: ${(props) => props.theme.colors.grayScale06};
  border-radius: 4px;
  position: relative;
  overflow: hidden;

  object {
    width: 111%;
    position: absolute;
    top: -70px;
    left: -4px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

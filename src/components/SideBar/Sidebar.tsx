import styled from 'styled-components';

interface SidebarProps {
  children: React.ReactNode;
}

function Sidebar({ children }: SidebarProps) {
  return <StyledContainer>{children}</StyledContainer>;
}

export default Sidebar;

const StyledContainer = styled.div`
  width: 360px;
  padding: 0 36px;
  margin: 24px 0;
  border-left: 1px solid ${({ theme }) => theme.colors.grayScale06};
`;

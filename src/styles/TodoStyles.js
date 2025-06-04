import styled from 'styled-components';

export const TodoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #f0f7ff 0%, #e9ecef 100%);
`;

export const AppWindow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 900px;
  height: 600px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
`;

export const Sidebar = styled.div`
  width: 250px;
  padding: 2rem;
  border-right: 1px solid #f0f0f0;
`;

export const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const CategoryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
  }

  &.active {
    background: #e8f0fe;
    color: #1a73e8;
  }
`;

export const NewListButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, #1a73e8, #1557b0);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

export const ContentArea = styled.div`
  flex: 1;
  padding: 2rem;
`;

export const Section = styled.div`
  margin-bottom: 1.5rem;
`;

export const SectionTitle = styled.h3`
  margin-bottom: 0.75rem;
  color: #333;
`;

export const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const TaskItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  background: #f8f9fa;
  transition: all 0.2s ease;

  &:hover {
    background: #e9ecef;
  }
`;

export const TaskCheckbox = styled.input`
  margin-right: 0.75rem;
`;

export const AddTaskButton = styled.button`
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #1a73e8, #1557b0);
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    opacity: 0.9;
  }
`;

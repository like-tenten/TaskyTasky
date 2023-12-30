import { ChangeEvent, SetStateAction, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { BLACK, GRAY, VIOLET, WHITE, RED } from '@/styles/ColorStyles';
import ArrowDropDownIcon from '@/public/icon/arrow_drop_down.svg';
import useModal from '@/hooks/useDropDown';
import useOnClickOutside from '@/hooks/useOnClickOutSide';
import DropDownList from './DropDownList';
import ColumnNameChip from '../Chip/ColumnNameChip';
import MoreIcon from '@/public/icon/more.svg';
import { FONT_14, FONT_18 } from '@/styles/FontStyles';
import { columnLists, memberLists } from '@/lib/types/type';
import ProfileImg from '../Profile/ProfileImg';
import { MemberListType } from '@/lib/types/members';
import { PostCardRequestType } from '@/lib/types/cards';
import { getFilteredUser } from '@/lib/utils/getFilteredUser';

interface Props {
  type: 'status' | 'member' | 'kebab';
  initialStatus?: string;
  initialMember?: string;
  initialMemberImg?: string;
  initialMemberId?: number;
  columnLists?: columnLists;
  memberLists?: MemberListType[];
  setReqValue?: (value: SetStateAction<PostCardRequestType>) => void;
}

interface Value {
  status: string;
  member: string;
  memberImage: string;
  memberId: number;
}

function DropDown({
  type,
  initialStatus,
  initialMember,
  initialMemberImg,
  initialMemberId,
  columnLists,
  memberLists,
  setReqValue,
}: Props) {
  const [value, setValue] = useState<Value>({
    status: initialStatus ? initialStatus : '',
    member: initialMember ? initialMember : '',
    memberImage: initialMemberImg ? initialMemberImg : '',
    memberId: initialMemberId ? initialMemberId : 0,
  });
  const [errorMessage, setErrorMessage] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const {
    isOpen: isDropDownOpen,
    handleDropDownOpen: handleDropDownOpen,
    handleDropDownClose: handleDropDownClose,
  } = useModal();

  useOnClickOutside(containerRef, handleDropDownClose);

  const handleAnchorRefClick = () => {
    if (type === 'member') return;
    if (isDropDownOpen) {
      handleDropDownClose();
    } else {
      handleDropDownOpen();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue((prev) => ({
      ...prev,
      member: e.target.value,
    }));
    setErrorMessage('');
  };

  const handleInputFocusOut = () => {
    if (value.member === '') {
      setErrorMessage('담당자를 입력해주세요.');
    }
  };

  const handleArrowIconClick = () => {
    if (type === 'status') return;
    if (isDropDownOpen) {
      handleDropDownClose();
    } else {
      handleDropDownOpen();
    }
  };

  const handleCheckMemberId = () => {
    if (!memberLists) return;

    const filteredMember = memberLists.filter((item) => item.nickname === value.member);
    if (setReqValue && filteredMember) {
      setReqValue((prev) => ({
        ...prev,
        assigneeUserId: filteredMember[0]?.id,
      }));
    }
  };

  useEffect(() => {
    if (!value.member) {
      handleDropDownClose();
    } else if (value.member) {
      handleDropDownOpen();
      handleCheckMemberId();
    }
  }, [value.member]);

  return (
    <>
      <StyledWrapper ref={containerRef} $type={type}>
        {(type === 'status' || type === 'member') && (
          <StyledMainWrapper>
            <StyledMainLabel>{type === 'status' ? '상태' : '담당자'}</StyledMainLabel>
            <StyledMainBox $isOpen={isDropDownOpen} $type={type} $error={errorMessage} onClick={handleAnchorRefClick}>
              {type === 'status' && value.status && <ColumnNameChip content={value.status} />}
              {type === 'member' && (
                <ProfileImg url={value.memberImage} name={value.member} size={26} id={value.memberId} />
              )}
              {type === 'member' && (
                <StyledInput
                  value={value.member}
                  onChange={handleInputChange}
                  onBlur={handleInputFocusOut}
                  placeholder="이름을 입력해 주세요"
                />
              )}
              {type === 'member' && !value.member ? null : (
                <StyledArrowIcon $type={type} onClick={handleArrowIconClick} />
              )}
            </StyledMainBox>
            {errorMessage && <StyledErrorMessage>{errorMessage}</StyledErrorMessage>}
          </StyledMainWrapper>
        )}
        {type === 'kebab' && <StyledKebabIcon onClick={handleAnchorRefClick} />}
      </StyledWrapper>
      {isDropDownOpen && (
        <DropDownList
          anchorRef={containerRef}
          setValue={setValue}
          value={value}
          type={type}
          handleDropDownClose={handleDropDownClose}
          columnLists={columnLists as columnLists}
          memberLists={memberLists as MemberListType[]}
        />
      )}
    </>
  );
}

export default DropDown;

const StyledWrapper = styled.div<{ $type: string }>`
  width: ${({ $type }) => ($type === 'kebab' ? '28px' : '217px')};
  display: flex;
  flex-direction: column;
  position: relative;
`;

const StyledMainWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledMainLabel = styled.h3`
  ${FONT_18};
  color: ${BLACK[2]};
`;

const StyledMainBox = styled.div<{ $isOpen: boolean; $type: string; $error: string }>`
  width: 100%;
  height: 48px;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
  border: 1px solid ${({ $error, $isOpen }) => ($error ? `${RED}` : $isOpen ? `${VIOLET[1]}` : `${GRAY[30]}`)};
  background-color: ${WHITE};
  ${({ $type }) => $type === 'status' && `cursor: pointer`};

  &:focus-within {
    border: 1px solid ${VIOLET[1]};
  }
`;

const StyledInput = styled.input`
  width: 100%;
  margin-left: 5px;

  &::placeholder {
    color: ${GRAY[40]};
  }
`;

const StyledArrowIcon = styled(ArrowDropDownIcon)<{ $type: string }>`
  position: ${({ $type }) => ($type === 'status' ? 'absolute' : 'static')};
  right: 10px;
  cursor: pointer;
`;

const StyledKebabIcon = styled(MoreIcon)`
  cursor: pointer;
`;

const StyledErrorMessage = styled.span`
  ${FONT_14};
  color: ${RED};
`;

import { Modal } from "@/components/ui/Form/Modal";
import { Icon } from "@iconify-icon/react";
import { useGetActionBoard } from "@/features/actions/api/useGetActionBoard";
import { Button, Skeleton } from "@/components/ui";
import { useInView } from "@/hooks/useInView";
import { memo, useEffect, useRef } from "react";
import { ActionMessage } from "@/features/actions/components/ActionMessage";

type BoardMembersProps = {
  boardId: string;
  onOpenChange?: (open: boolean) => void;
  triggerWrapper?: (triggerElement: React.ReactElement) => React.ReactElement;
};

export const ActionBoardList = memo(
  ({ boardId, onOpenChange, triggerWrapper }: BoardMembersProps) => {
    const membersItemWrapper = {
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
    };

    return (
      <Modal
        triggerButton={
          triggerWrapper ? (
            triggerWrapper(
              <>
                <Icon icon='material-symbols:format-list-bulleted-rounded' width='20' height='20' />
                Actions
              </>
            )
          ) : (
            <Button variant='ghost' size='sm' fs='sm'>
              <Icon icon='material-symbols:format-list-bulleted-rounded' width='20' height='20' />
              Actions
            </Button>
          )
        }
        title='Action List'
        onOpenChange={onOpenChange}
      >
        <div style={membersItemWrapper as React.CSSProperties}>
          <Action boardId={boardId} />
        </div>
      </Modal>
    );
  }
);

const Action = ({ boardId }: { boardId: string }) => {
  const debounce = useRef(false);
  const [ref, isInView] = useInView();
  const { data, isLoading, fetchNextPage, isFetching } = useGetActionBoard({
    boardId,
    size: 20,
  });

  useEffect(() => {
    if (isInView && !debounce.current && !isFetching) {
      debounce.current = true;
      fetchNextPage();

      setTimeout(() => {
        debounce.current = false;
      }, 200);
    }
  }, [isInView, isFetching, fetchNextPage]);

  const pageItem: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  };

  const membersItem = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
  };

  const itemDetails = {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  };

  if (isLoading) {
    return (
      <Skeleton.Group direction='column' gap={16}>
        <Skeleton.Group>
          <Skeleton width={32} height={32} variant='circle' />
          <Skeleton width={260} height={28} variant='rounded' />
        </Skeleton.Group>
        <Skeleton.Group>
          <Skeleton width={32} height={32} variant='circle' />
          <Skeleton width={140} height={28} variant='rounded' />
        </Skeleton.Group>
        <Skeleton.Group>
          <Skeleton width={32} height={32} variant='circle' />
          <Skeleton width={190} height={28} variant='rounded' />
        </Skeleton.Group>
      </Skeleton.Group>
    );
  }

  return (
    <>
      {data?.pages.map((page) => (
        <div key={page.page.number} style={pageItem}>
          <>
            {page.content?.map((action) => (
              <div key={action.id} style={membersItem}>
                <div style={itemDetails}>
                  {action.user.avatarUrl ? (
                    <img src={action.user.avatarUrl} className='profile-img' />
                  ) : (
                    <div className='user-profile'>{action.user.email?.charAt(0).toUpperCase()}</div>
                  )}
                  <span>
                    <ActionMessage action={action} />
                  </span>
                </div>
              </div>
            ))}
          </>
        </div>
      ))}
      <PageEdge ref={ref} />
    </>
  );
};

const PageEdge = memo(({ ref }: { ref: React.Ref<HTMLDivElement> }) => {
  return <div ref={ref} style={{ visibility: "hidden", height: "10px" }}></div>;
});

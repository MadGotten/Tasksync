import "@/components/ui/Form/Form.css";
import { Button } from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BoardApi } from "@/api/boards";
import { Modal } from "@/components/ui/Form/Modal";
import Form from "@/components/ui/Form/Form";
import { Input } from "@/components/ui/Form/Input";
import { Icon } from "@iconify-icon/react";
import { Checkbox } from "@/components/ui/Form/Checkbox";
import { SpinnerIcon } from "@/assets/icons";
import { useGetBoard } from "../api/useGetBoard";

export const EditBoard = ({
  boardId,
  onOpenChange,
  triggerWrapper,
  modalOpen,
}: {
  boardId: string;
  onOpenChange?: (open: boolean) => void;
  triggerWrapper?: (triggerElement: React.ReactElement) => React.ReactElement;
  modalOpen?: boolean;
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: BoardApi.updatePartialBoard,
    onSuccess: (data) => {
      queryClient.setQueryData(["board", boardId], () => {
        return data;
      });
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  const {
    data: board,
    isFetching,
    isLoading,
  } = useGetBoard({
    boardId,
    options: { enabled: modalOpen && !!boardId },
  });

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isFetching) return;

    const formData = new FormData(e.currentTarget);
    mutation.mutate({
      boardId,
      name: formData.get("name") as string,
      is_public: formData.get("is_public") !== null,
    });
  };

  const spinnerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "40px",
  };

  return (
    <Modal
      triggerButton={
        triggerWrapper ? (
          triggerWrapper(
            <>
              <Icon icon='material-symbols:settings-outline' width='20' height='20' />
              Settings
            </>
          )
        ) : (
          <Button variant='ghost' size='sm' fs='sm'>
            <Icon icon='material-symbols:settings-outline' width='20' height='20' />
            Settings
          </Button>
        )
      }
      isDone={mutation.isSuccess}
      title='Board Settings'
      onSubmit={handleFormSubmit}
      onOpenChange={onOpenChange}
    >
      {isLoading ? (
        <div style={spinnerStyle}>
          <SpinnerIcon />
        </div>
      ) : (
        <>
          <Form.Field label='Board name'>
            <Input
              name='name'
              placeholder='Enter board name'
              defaultValue={board?.name || ""}
              autoFocus
            />
          </Form.Field>
          <Form.Field label='Public' reversed stacked={false}>
            <Checkbox id='form-private' name='is_public' defaultChecked={board?.is_public} />
          </Form.Field>
        </>
      )}
      <Form.Actions>
        <Button
          type='submit'
          variant='primary'
          full
          size='lg'
          fs='sm'
          isLoading={mutation.isPending || mutation.isSuccess}
        >
          Save
        </Button>
      </Form.Actions>
    </Modal>
  );
};

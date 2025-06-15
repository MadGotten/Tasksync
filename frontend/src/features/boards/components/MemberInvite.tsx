import { memo, useState } from "react";
import { Button } from "@/components/ui";
import { Icon } from "@iconify-icon/react";
import { BoardApi } from "@/api/boards";
import { Modal } from "@/components/ui/Form/Modal";
import Form from "@/components/ui/Form/Form";
import { useMutation } from "@tanstack/react-query";

type InviteFormProps = {
  boardId: string;
  onOpenChange?: (open: boolean) => void;
  triggerWrapper?: (triggerElement: React.ReactElement) => React.ReactElement;
};

export const MemberInvite = memo(({ boardId, onOpenChange, triggerWrapper }: InviteFormProps) => {
  const mutation = useMutation({
    mutationFn: BoardApi.inviteToBoard,
  });

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    mutation.mutate({ boardId, email });
    setEmail("");
  };

  return (
    <Modal
      triggerButton={
        triggerWrapper ? (
          triggerWrapper(
            <>
              <Icon icon='material-symbols:person-add-outline' width='20' height='20' />
              Invite
            </>
          )
        ) : (
          <Button variant='ghost' size='sm' fs='sm'>
            <Icon icon='material-symbols:person-add-outline' width='20' height='20' />
            Invite
          </Button>
        )
      }
      isDone={mutation.isSuccess}
      title='Invite to Board'
      onSubmit={handleSubmit}
      onOpenChange={onOpenChange}
    >
      {mutation.isSuccess ? (
        <div className='success-message'>
          <Icon icon='material-symbols:check-circle' width='24' height='24' />
          <p>Invitation sent successfully!</p>
        </div>
      ) : (
        <>
          <Form.Field label='Email Address'>
            <div className='input-icon'>
              <Icon icon='material-symbols:mail-outline' className='icon' width='20' height='20' />
              <input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter email address'
                className='input-icon__field'
                required
                autoFocus
              />
            </div>
            {(error || mutation.isError) && (
              <p className='error'>{error || mutation.error?.message}</p>
            )}
          </Form.Field>
          <p className='helper-text'>
            The user will receive an email invitation to collaborate on this board.
          </p>
          <Form.Actions>
            <Button
              variant='primary'
              type='submit'
              size='lg'
              full
              fs='sm'
              isLoading={mutation.isPending || mutation.isSuccess}
            >
              Send Invitation
            </Button>
          </Form.Actions>
        </>
      )}
    </Modal>
  );
});

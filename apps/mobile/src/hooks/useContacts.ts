import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContact, deleteContact, listContacts, sendContactVerification, updateContact } from "../api/contacts";
import { queryKeys } from "../constants/query-keys";
import { useContactsStore } from "../store/contacts.store";

export function useContacts() {
  const queryClient = useQueryClient();
  const search = useContactsStore((state) => state.search);

  const contactsQuery = useQuery({
    queryKey: queryKeys.contacts,
    queryFn: listContacts,
  });

  const items =
    contactsQuery.data?.filter((contact) => {
      const term = search.trim().toLowerCase();
      if (!term) {
        return true;
      }

      return (
        contact.name.toLowerCase().includes(term) ||
        contact.phone.toLowerCase().includes(term) ||
        contact.relationship.toLowerCase().includes(term)
      );
    }) ?? [];

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.contacts });

  return {
    ...contactsQuery,
    items,
    createMutation: useMutation({
      mutationFn: createContact,
      onSuccess: invalidate,
    }),
    updateMutation: useMutation({
      mutationFn: ({ id, input }: { id: string; input: Parameters<typeof updateContact>[1] }) =>
        updateContact(id, input),
      onSuccess: invalidate,
    }),
    deleteMutation: useMutation({
      mutationFn: deleteContact,
      onSuccess: invalidate,
    }),
    verifyMutation: useMutation({
      mutationFn: sendContactVerification,
      onSuccess: invalidate,
    }),
  };
}

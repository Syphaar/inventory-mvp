// import * as React from "react";
// import { useFormContext } from "react-hook-form";

// // import type { FieldPath, FieldValues } from "react-hook-form";
// // import type { FieldValues, FieldPath, UseFormReturn } from "react-hook-form";

// type FormFieldContextValue< TFieldValues = any, TName = string > = {
//   name: TName;
// };

// // const FormFieldContext = React.createContext<any>(null);
// // const FormItemContext = React.createContext<any>(null);
// const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

// type FormItemContextValue = {
//   id: string;
// };
// const FormItemContext = React.createContext<FormItemContextValue | null>(null);

// // export const useFormField = () => {
// //   const fieldContext = React.useContext(FormFieldContext);
// //   const itemContext = React.useContext(FormItemContext);
// //   const { getFieldState, formState } = useFormContext();

// //   if (!fieldContext) {
// //     throw new Error("useFormField should be used within <FormField>");
// //   }

// //   if (!itemContext) {
// //     throw new Error("useFormField should be used within <FormItem>");
// //   }

// //   const fieldState = getFieldState(fieldContext.name, formState);
// //   const { id } = itemContext;

// //   return {
// //     id,
// //     name: fieldContext.name,
// //     formItemId: `${id}-form-item`,
// //     formDescriptionId: `${id}-form-item-description`,
// //     formMessageId: `${id}-form-item-message`,
// //     ...fieldState,
// //   };
// // };

// export const useFormField = () => {
//   const fieldContext = React.useContext(FormFieldContext);
//   const itemContext = React.useContext(FormItemContext);
//   const { getFieldState, formState } = useFormContext();

//   if (!fieldContext) {
//     throw new Error("useFormField should be used within <FormField>");
//   }

//   if (!itemContext) {
//     throw new Error("useFormField should be used within <FormItem>");
//   }

//   const fieldState = getFieldState(fieldContext.name, formState);
//   const { id } = itemContext;

//   return {
//     id,
//     name: fieldContext.name,
//     formItemId: `${id}-form-item`,
//     formDescriptionId: `${id}-form-item-description`,
//     formMessageId: `${id}-form-item-message`,
//     ...fieldState,
//   };
// };

// export { FormFieldContext, FormItemContext };

import * as React from "react";
import { useFormContext, type FieldValues, type FieldPath } from "react-hook-form";

/**
 * =========================
 * Context Types
 * =========================
 */

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

type FormItemContextValue = {
  id: string;
};

/**
 * =========================
 * Contexts
 * =========================
 */

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

const FormItemContext = React.createContext<FormItemContextValue | null>(null);

/**
 * =========================
 * Hook
 * =========================
 */

export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  if (!itemContext) {
    throw new Error("useFormField should be used within <FormItem>");
  }

  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

/**
 * =========================
 * Exports
 * =========================
 */

export { FormFieldContext, FormItemContext };

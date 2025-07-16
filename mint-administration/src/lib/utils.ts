import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formUpdator(
  currentEntity: Record<string, any>,
  updateForm: Record<string, any>,
  setUpdateForm: React.Dispatch<React.SetStateAction<Record<string, any>>>
) {


  return [
    (
      key: string,
      value: any
    ) => {

      console.log(key, value)

      const updateFormCopy = { ...updateForm }
      if (currentEntity[key] === value) {
        delete updateFormCopy[key]
      } else updateFormCopy[key] = value

      console.log(updateFormCopy)

      setUpdateForm(updateFormCopy)
    }
  ]
}
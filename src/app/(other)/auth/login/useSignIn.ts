'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { useNotificationContext } from '@/context/useNotificationContext'
import useQueryParams from '@/hooks/useQueryParams'

const useSignIn = () => {
  const [loading, setLoading] = useState(false)
  const { push } = useRouter()
  const { showNotification } = useNotificationContext()

  const queryParams = useQueryParams()

  const loginFormSchema = yup.object({
    email: yup.string().required('Please enter your email'),
    password: yup.string().required('Please enter your password'),
  })

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  type LoginFormFields = yup.InferType<typeof loginFormSchema>

  const login = handleSubmit(async (values: LoginFormFields) => {
    setLoading(true)
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: values?.email,
        password: values?.password,
      })

      if (res?.ok) {
        push(queryParams['redirectTo'] ?? '/dashboard/analytics')
        showNotification({ message: 'เข้าสู่ระบบสำเร็จ', variant: 'success' })
      } else {
        showNotification({ message: res?.error ?? 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', variant: 'danger' })
      }
    } catch (error) {
      showNotification({ message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ', variant: 'danger' })
    } finally {
      setLoading(false)
    }
  })

  return { loading, login, control }
}

export default useSignIn

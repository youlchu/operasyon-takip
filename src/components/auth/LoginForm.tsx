"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const loginSchema = z.object({
  email: z.string().email('Gecerli bir email girin'),
  password: z.string().min(1, 'Sifre zorunludur'),
})

type LoginFormValues = z.infer<typeof loginSchema>

/**
 * Giris formu bileseni.
 * React Hook Form + Zod validation kullanir.
 * Basarili giriste kullanici rolune gore dashboard'a yonlendirilir.
 */
export function LoginForm() {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(values: LoginFormValues) {
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Email veya sifre hatali')
        return
      }

      // Tam sayfa navigasyonu — session cookie kesinlikle hazir,
      // middleware JWT'den rolu okuyup dogru dashboard'a yonlendirir
      window.location.href = '/'
    } catch {
      toast.error('Giris yapilirken bir hata olustu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Operasyon Takip</h1>
          <p className="text-sm text-gray-500 mt-1">Hesabiniza giris yapin</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Input
            label="Email"
            type="email"
            id="email"
            placeholder="ornek@sirket.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Sifre"
            type="password"
            id="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="mt-2"
          >
            Giris Yap
          </Button>
        </form>
      </div>
    </div>
  )
}

import pb from '@/lib/pocketbase/client'
import { User } from '@/types'

export const getUsers = () => pb.collection('users').getFullList<User>({ sort: 'name' })
export const getUser = (id: string) => pb.collection('users').getOne<User>(id)
export const createUser = (data: FormData | Record<string, any>) =>
  pb.collection('users').create<User>(data)
export const updateUser = (id: string, data: FormData | Record<string, any>) =>
  pb.collection('users').update<User>(id, data)
export const deleteUser = (id: string) => pb.collection('users').delete(id)

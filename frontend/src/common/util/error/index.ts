import axios from 'axios';
import Swal from 'sweetalert2';
import router from '@/router';
import { request } from '@/common/configs/axios';
import { store } from '@/store';
import { AxiosErrorType, SocektError } from '../../interfaces/error.interface';

// eslint-disable-next-line import/prefer-default-export
export const socketErrorHandler = async (message: SocektError, callback: { (): void } | null): Promise<void> => {
  if (message.error) {
    Swal.fire({
      title: `${message?.error.statusCode}: ${message?.error.error}`,
      text: message?.error.message,
      icon: 'error',
      timer: 3000,
    }).then(() => {
      if (message.error.message === 'refresh token error') {
        router.push({ name: 'login' });
      }
    });
  }
};

export const axiosErrorHandler = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    // const router = useRouter();
    const message: AxiosErrorType | null = error.response ? error.response.data : null;
    if (message) {
      Swal.fire({
        title: `${message.statusCode}: ${message.error}`,
        text: message.message,
        icon: 'error',
        timer: 3000,
      });
    }
    return message?.message;
  }
  if (error instanceof MessageEvent) {
    if (error.data === 'SSE ERROR') {
      Swal.fire({
        title: `자동업데이트가 오류가 발생하였습니다.`,
        text: '새로고침하여 다시 접속해주세요.',
        icon: 'error',
        timer: 3000,
      });
    }
    return error.data;
  }

  Swal.fire({
    title: `알수없는 오류가 발생하였습니다.`,
    text: '새로고침하여 다시 접속해주세요.',
    icon: 'error',
    timer: 3000,
  });
  return error;
};

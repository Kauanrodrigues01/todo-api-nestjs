export const ValidationMessages = {
  // Geral - validações comuns
  EMAIL_INVALID: 'O email informado não é válido',
  EMAIL_REQUIRED: 'O email é obrigatório',

  PASSWORD_REQUIRED: 'A senha é obrigatória',
  PASSWORD_STRING: 'A senha deve ser uma string',

  FIELD_REQUIRED: (field: string) => `O campo ${field} é obrigatório`,
  FIELD_STRING: (field: string) => `O campo ${field} deve ser uma string`,
  MIN_LENGTH: (field: string, minLength: number) =>
    `O campo ${field} deve ter no mínimo ${minLength} caracteres`,
  LENGTH: (field: string, minLength: number, maxLength: number) =>
    `O campo ${field} deve ter entre ${minLength} e ${maxLength} caracteres`,
  ENUM_INVALID: (field: string, enumValid: object) =>
    `O campo ${field} só pode ter um dos seguintes valores: ${Object.values(enumValid).join(', ')}`,

  // Mensagens de autenticação
  AUTH_INVALID_EMAIL: 'Email inválido',
  AUTH_INVALID_PASSWORD: 'Senha inválida',
  TOKEN_NOT_PROVIDED: 'Token não fornecido',
  TOKEN_INVALID: 'Token inválido',

  // Mensagens específicas por domínio
  TASK: {
    NOT_FOUND: (id: number) => `Tarefa com o ID ${id} não encontrada`,
  },

  USER: {
    NOT_FOUND: (id: number) => `Usuário com o ID ${id} não encontrado`,
    DISABLED:
      'Sua conta foi desativada. Entre em contato com o suporte caso necessário.',
  },

  IMAGE: {
    INVALID_FORMAT:
      'Apenas imagens nos formatos .jpeg, .jpg ou .png são permitidas',
    MAX_SIZE: (size: string) =>
      `O tamanho máximo permitido para a imagem é de ${size}`,
  },
};

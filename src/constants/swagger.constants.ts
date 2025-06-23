import { ApiResponseOptions } from '@nestjs/swagger';

export const SwaggerResponses: Record<number, ApiResponseOptions> = {
  400: {
    status: 400,
    description: 'Bad request (validation failed or missing parameters)',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'email must be a valid email address',
          'password must be at least 6 characters long',
        ],
        error: 'Bad Request',
      },
    },
  },
  401: {
    status: 401,
    description: 'Unauthorized (missing or invalid token)',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  },
  409: {
    status: 409,
    description: 'Conflict (resource already exists)',
    schema: {
      example: {
        statusCode: 409,
        message: 'Email or username already exists',
        error: 'Conflict',
      },
    },
  },
  500: {
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Unexpected error occurred',
        error: 'Internal Server Error',
      },
    },
  },
};
import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { SwaggerResponses } from '../constants/swagger.constants';

/**
 * Adds standardized error responses to an endpoint.
 * Usage: @ApiErrorResponses([400, 401])
 */
export function ApiErrorResponses(
  codes: (400 | 401 | 409 | 500)[] = [400, 401, 500],
) {
  const decorators = codes.map((code) => ApiResponse(SwaggerResponses[code]));
  return applyDecorators(...decorators);
}

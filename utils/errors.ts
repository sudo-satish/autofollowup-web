class ForbiddenError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}

export const sendErrorResponse = (error: Error) => {
  if (error instanceof ForbiddenError) {
    return new Response(
      JSON.stringify({ title: error.message, status: error.statusCode }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } else {
    console.error(error);
  }

  return new Response(
    JSON.stringify({ title: 'Internal server error', status: 500 }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

export { ForbiddenError };

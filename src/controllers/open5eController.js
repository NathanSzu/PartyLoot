const BASE_URL = 'https://api.open5e.com/v1';

export const searchMagicItems = async (queryParams, limit = 10) => {
  try {
    let url;
    if (queryParams?.nextPage || queryParams?.prevPage) {
      url = queryParams.nextPage || queryParams.prevPage;
    } else {
      url = new URL('/magicitems/', BASE_URL);
      const params = new URLSearchParams({
        ...queryParams,
        limit,
      });
      url.search = params.toString();
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error retrieving magic items:', error);
    throw error;
  }
};

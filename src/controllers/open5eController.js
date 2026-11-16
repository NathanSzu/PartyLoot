const BASE_URL = 'https://api.open5e.com/v2/magicitems/';

export const searchMagicItems = async (queryParams, limit = 10) => {
  try {
    let url;
    if (queryParams?.nextPage || queryParams?.prevPage) {
      url = queryParams.nextPage || queryParams.prevPage;
    } else {
      url = new URL(BASE_URL);
      const params = new URLSearchParams({ limit: String(limit) });
      if (queryParams?.search) params.set('name__icontains', queryParams.search);
      if (queryParams?.type) params.set('category', queryParams.type.toLowerCase().replace(/\s+/g, '-'));
      if (queryParams?.rarity) params.set('rarity', queryParams.rarity.toLowerCase().replace(/\s+/g, '-'));
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

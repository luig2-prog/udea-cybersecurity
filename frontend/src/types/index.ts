export interface Device {
  id: string;
  name: string;
  model: string;
  storage: string;
}

export interface RandomUser {
  name: {
    first: string;
    last: string;
  };
  location: {
    city: string;
    country: string;
  };
  login: {
    username: string;
  };
  picture: {
    medium: string;
  };
}

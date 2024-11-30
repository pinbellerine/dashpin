// store.tsx
import { createSignal } from "solid-js";

// Create a store for gender and address data
const [genderData, setGenderData] = createSignal({});
const [addressData, setAddressData] = createSignal({});

// Function to update gender and address data
const updateData = (gender: Record<string, number>, address: Record<string, string>) => {
  setGenderData(gender);
  setAddressData(address);
};

// Function to get gender and address data
const getData = () => ({
  gender: genderData(),
  address: addressData(),
});

export { updateData, getData };

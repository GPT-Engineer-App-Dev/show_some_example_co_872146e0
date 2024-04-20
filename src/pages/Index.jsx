import React, { useState } from "react";
import { Box, FormControl, FormLabel, Input, Button, Text, useToast, Image, SimpleGrid } from "@chakra-ui/react";

const exampleColors = [
  { hex: "ff0000", name: "Red" },
  { hex: "00ff00", name: "Green" },
  { hex: "0000ff", name: "Blue" },
  { hex: "ffff00", name: "Yellow" },
  { hex: "ff00ff", name: "Magenta" },
  { hex: "00ffff", name: "Cyan" },
];
import { FaSearch } from "react-icons/fa";

const Index = () => {
  const [hexCode, setHexCode] = useState("");
  const [colorName, setColorName] = useState("");
  const [colorSwatch, setColorSwatch] = useState(null);
  const toast = useToast();

  const fetchColorName = async (hex) => {
    try {
      const response = await fetch(`https://api.color.pizza/v1/${hex}`);
      if (!response.ok) {
        throw new Error("Color not found");
      }
      const data = await response.json();
      if (data.colors && data.colors.length > 0) {
        setColorName(data.colors[0].name);
        setColorSwatch(data.colors[0].swatchImg.svg);
      } else {
        setColorName("Color name not found");
        setColorSwatch(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchColorName(hexCode.replace("#", ""));
  };

  return (
    <Box p={4}>
      <FormControl id="hex-color" as="form" onSubmit={handleSubmit}>
        <FormLabel>Enter HEX Color Code</FormLabel>
        <Input type="text" placeholder="e.g., #1a2b3c" value={hexCode} onChange={(e) => setHexCode(e.target.value)} />
        <Button leftIcon={<FaSearch />} mt={2} colorScheme="blue" type="submit">
          Translate Color
        </Button>
      </FormControl>
      {colorName && (
        <Box mt={4}>
          <Text fontSize="xl" fontWeight="bold">
            Color Name: {colorName}
          </Text>
          {colorSwatch && <Box mt={2} dangerouslySetInnerHTML={{ __html: colorSwatch }} />}
        </Box>
      )}
      <Box mt={8}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Example Colors
        </Text>
        <SimpleGrid columns={[2, null, 3]} spacing={4}>
          {exampleColors.map((color) => (
            <Box key={color.hex} borderWidth={1} borderRadius="md" p={4} textAlign="center">
              <Image src={`https://api.color.pizza/v1/swatch?color=${color.hex}`} alt={color.name} mb={2} mx="auto" />
              <Text fontWeight="bold">{color.name}</Text>
              <Text>{`#${color.hex}`}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default Index;

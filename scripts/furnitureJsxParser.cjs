const fs = require("fs");
const readline = require("readline");

const ver = "v0.1";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function generateText(props) {
  function generateTextureUseEffectBlock(furName) {
    return `const texture_url = texturePath + \`/${furName}_\${props.color}.png\`;
  const meshRef = useRef();

  useEffect(() => {
    const loader = new TextureLoader();
    loader.load(texture_url, (t) => {
      t.magFilter = NearestFilter;
      t.minFilter = LinearMipMapLinearFilter;
      t.encoding = sRGBEncoding;

      t.flipY = false; // for some reason, in this model it's necessary to flip the texture in the y axis
      meshRef.current.material.map = t;
    });
  }, [props.color]);`;
  }

  return `// File generated by furnitureJsxParser ${ver} (https://github.com/IsPeG)
import React${props.colors && ", { useEffect, useRef }"} from "react";
import { useGLTF ${props.colors && ", useTexture"}} from "@react-three/drei";
${
  props.colors &&
  'import {TextureLoader, NearestFilter, LinearMipMapLinearFilter, sRGBEncoding, DoubleSide} from "three";'
}


const modelsPath = "/src/assets/models";
${
  props.colors &&
  `const texturePath = "/src/assets/textures/furniture/${props.modelName}";`
}

useGLTF.preload(modelsPath + "/furniture/${props.modelName}.gltf");

${props.colors && props.colors.join("\n")}

export default function ${props.componentName}(props) {
  const { nodes, materials } = useGLTF(modelsPath + "/furniture/${
    props.modelName
  }.gltf");

  ${props.colors && generateTextureUseEffectBlock(props.modelName)}

  return (
    // PLACE HERE ALL THE JSX GENERATED BY THE GLTFJSX TOOL (https://github.com/pmndrs/gltfjsx)
    // IN THE MESH COMPONENT, PLACE THE NEXT PROP:
    // ref={meshRef}
    ${
      props.colors &&
      "// IF THIS IS GENERATED, IT MEANS THE FUR HAVE COLORS. \n    // APPEND THIS TO THE MESH COMPONENT: \n    // <meshStandardMaterial map={nodes.croton.material.map} side={DoubleSide} // DoubleSide makes the texture visible also for the inner surfaces of the model />"
    }
  );
}`;
}

console.log("\x1b[33m%s\x1b[0m", `\n   ╔═════════════════════════════════╗`);
console.log("\x1b[33m%s\x1b[0m", `     Fuble Furniture Jsx Parser ${ver} `);
console.log("\x1b[33m%s\x1b[0m", `   ╚═════════════════════════════════╝`);
console.log("\x1b[33m%s\x1b[0m", `   🌳🌲🌾🌲🌷🌾🌾🌲🌳🌷🌳🌳🌾🌲🌲🌷🌳\n`);

rl.question(`🍊 Write the furniture name in PascalCase ▷ `, (furName) => {
  rl.question(
    `🥝 Write the colors the furniture have separated by spaces (can be blank if none) ▷ `,
    (colorsString) => {
      rl.question(
        `🍋 Write the name of the series in PascalCase (can be blank if none) ▷ `,
        (seriesName) => {
          // DATA PARSING
          var colors = colorsString !== "" ? colorsString.split(" ") : "";
          const modelName = furName
            .split(/\.?(?=[A-Z])/)
            .join("_")
            .toLowerCase();

          if (seriesName) seriesName = `${seriesName}/`;

          if (colors) {
            colors = colors.map((elem) => {
              return `useTexture.preload(texturePath + '/${
                modelName + "_" + elem
              }.png');`;
            });
          }

          const props = {
            colors: colors,
            componentName: furName,
            modelName: modelName,
            furName: furName.toLowerCase(),
          };

          const fileContent = generateText(props);
          const path =
            "./src/components/furniture/" +
            seriesName +
            furName[0].toUpperCase() +
            furName.slice(1) +
            ".jsx";

          if (fs.existsSync(path)) {
            console.log(
              "\x1b[91m%s\x1b[0m",
              "⚠︎ ERROR: There is a file with the same name. To prevent corruption, the process will end."
            );
            rl.close();
            return;
          }

          fs.appendFile(path, fileContent, (err) => {
            if (err) {
              if (err.code == "ENOENT") {
                console.log(
                  "\x1b[91m%s\x1b[0m",
                  "⚠︎ ERROR: The directory does not exist (the series name is probably spelled wrong)"
                );
              } else {
                console.error(err.code);
              }
            } else {
              console.log(
                "\x1b[32m%s\x1b[0m",
                `\n✅ Done! File created on ${path}\n`
              );
            }
            rl.close();
          });
        }
      );
    }
  );
});

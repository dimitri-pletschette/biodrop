import dynamic from 'next/dynamic';

// Function to return default icon
function returnDefault() {
  return dynamic(() =>
    import('react-icons/fa').then((mod) => mod.FaGlobe)
  )
}
export default function getIcon(name = "FaGlobe") {
  let icon;

  switch (name.slice(0, 2)) {
    case "Fa":
      icon = dynamic(() =>
        import('react-icons/fa')
          .then((mod) => {
            let node = mod[name];
            if(!node) node=returnDefault();
            return node;
          })
      )
      break;
    case "Si":
      icon = dynamic(() =>
        import('react-icons/si')
          .then((mod) => {
            let node = mod[name];
            if(!node) node=returnDefault();
            return node;
          })
      )
      break;
  }

  if (!icon) {
    return returnDefault();
  }

  return icon;
}

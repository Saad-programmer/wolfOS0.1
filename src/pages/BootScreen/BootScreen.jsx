import { GiWolfHowl } from 'react-icons/gi'; // Replacing Windows icon with a wolf icon

import BootLogo from '../../components/BootLogo/BootLogo';
import './BootScreen.scss';

const BootScreen = () => (
  <div className="BootScreen">
    <div className="brandlogo">
      <GiWolfHowl size={270} color="#ccc" /> {/* You can customize size and color */}
    </div>
    <div className="bootlogo">
      <BootLogo />
    </div>
  </div>
);

export default BootScreen;

import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import config from '@/config'

import ArrowRightDrop from '@/components/icons/ArrowRightDrop'
import Setting from '@/components/icons/Setting'
import Companies from '@/components/icons/Companies'
import Bell from '@/components/icons/Bell'
import Search from '@/components/icons/Search'
import Chat from '@/components/icons/Chat'
import Account from '@/components/icons/Account'
import HomeIcon from '@/components/icons/HomeIcon'
import SwapVertical from '@/components/icons/SwapVertical'
import EyeClose from '@/components/icons/EyeClose'
import EyeOpen from '@/components/icons/EyeOpen'
import Warning from '@/components/icons/Warning'
import WarningRed from '@/components/icons/WarningRed'
import Pincel from '@/components/icons/Pincel'
import OpenNewTab from '@/components/icons/OpenNewTab'
import PreviousAngleCircle from '@/components/icons/PreviousAngleCircle'
import Star from '@/components/icons/Star'
import StarFilled from '@/components/icons/StarFilled'
import Check from '@/components/icons/Check'
import VerifiedCheck from '@/components/icons/VerifiedCheck'
import CrossIcon from '@/components/icons/CrossIcon'
import CameraIcon from '@/components/icons/CameraIcon'
import ChevronLeftFilledIcon from '@/components/icons/ChevronLeftFilledIcon'
import HeartIcon from '@/components/icons/HeartIcon'
import PaperPlaneIcon from '@/components/icons/PaperPlaneIcon'
import BackArrow from '@/components/icons/BackArrow'
import LeadershipIcon from '@/components/icons/LeadershipIcon'
import IndepthIcon from '@/components/icons/IndepthIcon'
import CloseIcon from '@/components/icons/CloseIcon'
import EyeFillIcon from '@/components/icons/EyeFillIcon'
import OpenPaperPlaneIcon from '@/components/icons/OpenPaperPlaneIcon'
import MessagesIcon from '@/components/icons/MessagesIcon'
import DeleteIcon from '@/components/icons/DeleteIcon'
import NotificationBubbleIcon from '@/components/icons/NotificationBubbleIcon'
import DropdownIcon from '@/components/icons/DropdownIcon'
import MessageIcon from '@/components/icons/MessageIcon'
import EditIcon from '@/components/icons/EditIcon'
import Logo from '@/components/icons/Logo'
import LovedIcon from '@/components/icons/LovedIcon'
import StipendIcon from '@/components/icons/StipendIcon'
import TimeIcon from '@/components/icons/TimeIcon'
import UniversityIcon from '@/components/icons/UniversityIcon'
import CalenderIcon from '@/components/icons/CalenderIcon'
import FingerTouch from '@/components/icons/FingerTouch'
import FavouritedIcon from '@/components/icons/FavouritedIcon'
import GreenCross from '@/components/icons/GreenCross'

Vue.use(Vuetify)
const opts = {
  icons: {
    iconfont: 'mdi', // default - only for display purposes
    values: {
      GreenCross:{
        component: GreenCross
      },
      Logo: {
        component: Logo
      },
      ArrowRightDrop: {
        component: ArrowRightDrop
      },
      Search: {
        component: Search
      },
      Companies: {
        component: Companies
      },
      Chat: {
        component: Chat
      },
      Bell: {
        component: Bell
      },
      Account: {
        component: Account
      },
      Setting: {
        component: Setting
      },
      HomeIcon: {
        component: HomeIcon
      },
      SwapVertical: {
        component: SwapVertical
      },
      EyeClose: {
        component: EyeClose
      },
      EyeOpen: {
        component: EyeOpen
      },
      Warning: {
        component: Warning
      },
      WarningRed: {
        component: WarningRed
      },
      Pincel: {
        component: Pincel
      },
      OpenNewTab: {
        component: OpenNewTab
      },
      PreviousAngleCircle: {
        component: PreviousAngleCircle
      },
      Star: {
        component: Star
      },
      StarFilled: {
        component: StarFilled
      },
      Check: {
        component: Check
      },
      VerifiedCheck: {
        component: VerifiedCheck
      },
      CrossIcon: {
        component: CrossIcon
      },
      CameraIcon: {
        component: CameraIcon
      },

      ChevronLeft: {
        component: ChevronLeftFilledIcon
      },
      HeartIcon: {
        // custom icon
        component: HeartIcon
      },
      PaperPlaneIcon: {
        component: PaperPlaneIcon
      },
      BackArrow: {
        component: BackArrow
      },
      leadership: {
        component: LeadershipIcon
      },
      indepth: {
        component: IndepthIcon
      },
      close: {
        component: CloseIcon
      },
      eyeFill: {
        component: EyeFillIcon
      },
      openPaperPlane: {
        component: OpenPaperPlaneIcon
      },
      messages: {
        component: MessagesIcon
      },
      delete: {
        component: DeleteIcon
      },
      notification: {
        component: NotificationBubbleIcon
      },
      dropdown: {
        component: DropdownIcon
      },
      grayDropdown: {
        component: DropdownIcon,
        props: { fill: '#B8B8B8' }
      },
      message: {
        component: MessageIcon
      },
      edit: {
        component: EditIcon
      },
      calenderIcon: {
        component: CalenderIcon
      },
      fingerTouch: {
        component: FingerTouch
      },
      lovedIcon: {
        component: LovedIcon
      },
      stipendIcon: {
        component: StipendIcon
      },
      timeIcon: {
        component: TimeIcon
      },
      universityIcon: {
        component: UniversityIcon
      },
      favouritedIcon: {
        component: FavouritedIcon
      }
    }
  },
  theme: {
    themes: {
      light: config.light
    }
  }
}

export default new Vuetify(opts)

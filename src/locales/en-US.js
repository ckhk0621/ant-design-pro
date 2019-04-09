import analysis from './en-US/analysis';
import exception from './en-US/exception';
import form from './en-US/form';
import globalHeader from './en-US/globalHeader';
import login from './en-US/login';
import menu from './en-US/menu';
import monitor from './en-US/monitor';
import result from './en-US/result';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';
import pwa from './en-US/pwa';
import component from './en-US/component';
import editor from './en-US/editor';

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.home.introduce': 'introduce',
  'app.forms.basic.title': 'Basic form',
  'app.forms.basic.description':
    'Form pages are used to collect or verify information to users, and basic forms are common in scenarios where there are fewer data items.',
  ...analysis,
  ...exception,
  ...form,
  ...globalHeader,
  ...login,
  ...menu,
  ...monitor,
  ...result,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...editor,
  'app.notice.create.form.title': 'Create Notice',
  'app.notice.create.form.description': 'Create latest notice to company staffs',
  'app.notice.create.memo.form.title': 'Create Memo',
  'app.notice.create.memo.form.description': 'Create latest memo to company staffs',
  'app.notice.memo.list.description': 'Latest memo to company staffs',
  'app.notice.create.inout.form.title': 'Create In out record',
  'app.notice.create.ride.booking.title': 'Create Booking',
  'app.notice.create.ride.booking.description':
    'Only admin can edit the booking detail once created',
};

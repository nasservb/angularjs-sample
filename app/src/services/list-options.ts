export const LICENSES : Array<any> = [
    {value:'all-rights-reserved', text:'All rights reserved'},
    {value:'attribution-cc', text:'Attribution CC BY'},
    {value:'attribution-sharealike-cc', text:'Attribution-ShareAlike BY-SA'},
    {value:'attribution-noderivs-cc', text:'Attribution-NoDerivs CC BY-ND'},
    {value:'attribution-noncommercial-cc', text:'Attribution-NonCommerical CC BY-NC'},
    {value:'attribution-noncommercial-sharealike-cc', text:'Attribution-NonCommerical-ShareAlike CC BY-NC-SA'},
    {value:'attribution-noncommercial-noderivs-cc', text:'Attribution-NonCommerical-NoDerivs CC BY-NC-ND'},
    {value:'publicdomaincco', text:'Public Domain CCO "No Rights Reserved'},
    {value:'gnuv3', text:'GNU v3 General Public License'},
    {value:'gnuv1.3', text:'GNU v1.3 Free Documentation License'},
    {value:'gnu-lgpl', text:'GNU Lesser General Public License'},
    {value:'gnu-affero', text: 'GNU Affero General Public License'},
    {value:'apache-v1', text:'Apache License, Version 1.0'},
    {value:'apache-v1.1', text:'Apache License, Version 1.1'},
    {value:'apache-v2', text:'Apache License, Version 2.0'},
    {value:'mozillapublic', text:'Mozilla Public License'},
    {value:'bsd', text:'BSD License'}
];

export const CONTETNT_CATEGORY : Array<any> = [
  {value:'0', text:'جنگ نرم'},
  {value:'1', text:'شهدا و دفاع مقدس'},
  {value:'2', text:'مذهبی'},
  {value:'3', text:'فرهنگی'},
  {value:'4', text:'سیاسی'},
  {value:'5', text:'اقتصاد و صنعت'},
  {value:'6', text:'آموزشی'},
  {value:'7', text:'علم و فناوری '},
  {value:'8',                text:'ورزشی'},
  {value:'9', text:'هنری'},
  {value:'10', text:'تفریحی'},
  {value:'11', text:'طنز'}, 
  {value:'12', text:'سایر'}
];

export const ACCESS : Array<any> = [
  {value: 0, text: 'خصوصی'},
  {value: 1, text: 'کاربران سایت'},
  {value: 2, text: 'عمومی'}
];

export const REASONS : Array<any> = [
  { value: 1, label: 'معرفی و تبلیغات گروه ها و احزاب مغایر با قوانین کشور' },
  { value: 2, label: 'نقض قوانین محرمانگی ،مالکیت معنوی و حریم شخصی' },
  { value: 3, label: 'اهانت آمیزبودن به اقلیت های قومی و مذهبی' },
  { value: 4, label: 'مغایرت داشتن با شئونات اخلاقی و عرف جامعه' },
  { value: 6, label: 'نشر اکاذیب و تشویش اذهان عمومی' },
  { value: 5, label: 'توهین آمیز بودن به افراد و مقامات' },
  { value: 7, label: 'دلخراش و آزار دهنده بودن' },
  { value: 8 , label: 'محتوای تبلیغاتی' },
  { value: 9, label: 'اسپم' },
  { value: 10, label: 'سایر موارد' }
];

export const REPORT_ACTIONS = {
  'explicit': 'نشان گذاری به عنوان صرفه نظر شده',
  'spam': 'نشان گذاری به عنوان اسپم',
  'delete': 'حذف'
};

export const SERVICE_OWNER : Array<any> = [
    { value: 1, label: 'این کسب و کار متعلق به دیگران است' },
    { value: 2, label: 'این کسب و کار متعلق به من است' }
];

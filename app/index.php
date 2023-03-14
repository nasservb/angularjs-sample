<?php
    if (!defined('__MINDS_CONTEXT__')) {
        define('__MINDS_CONTEXT__', 'app');
    }
    $aotPrefix = '';
    $language = Minds\Core\Di\Di::_()->get('I18n')->getLanguage() ?: 'fa';
    if(in_array($language, [ 'en', 'es','fa'])){
        $aotPrefix = $language === 'fa' ? '' : '.' . $language;
    }
?>
<html>
  <head>
    <base href="/" />
    <meta charset="utf-8">
    <link rel="icon" type="image/png" href="/assets/icon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1,user-scalable=no">
    <?php
      $meta = Minds\Core\SEO\Manager::get();
      foreach($meta as $name => $content){
        $name = strip_tags($name);
        $content = str_replace(['"'], '\'', $content);
        switch($name){
          case "title":
            echo "<title>$content</title>\n";
            break;
          case strpos($name, ":") !== FALSE:
            echo "<meta property=\"$name\" content=\"$content\">\n";
            break;
          default:
            echo "<meta name=\"$name\" content=\"$content\">\n";
        }
      }
    ?>
    <link rel="stylesheet" href="/stylesheets/material.blue_grey-amber.min.css" />
    <link rel="stylesheet" href="/stylesheets/material-icon.css">
    <link rel="stylesheet" href="/stylesheets/select2.min.css">
    <script src="/js/material.min.js"></script>
    <script src="/js/select2/jquery.min.js"></script>
    <!-- Bootstrap 3.3.7 -->
    <script src="/js/select2/bootstrap.min.js"></script>
    <!-- Select2 -->
    <script src="/js/select2/select2.full.min.js"></script>
    <!-- inject:css -->
	<script src='https://www.google.com/recaptcha/api.js'></script>
    <!-- endinject -->
    <script>
      var ua = window.navigator.userAgent;
      if(ua.indexOf("MSIE") > -1 ||
        (ua.indexOf("Android 4.3") > -1 && !(ua.indexOf('Chrome') > -1)) //android 4.3, but not chrome browser
        ){
          window.location.href = window.location.href.replace('<?= Minds\Core\Config::_()->get('site_url') ?>', 'http://www.afsaran.ir/not-supported');
      }
    </script>
      <script>
          $(function () {
              //Initialize Select2 Elements
              $('.select2').select2()
          })
      </script>
  </head>
  <body>
    <?php if (__MINDS_CONTEXT__ === 'embed'): ?>
        <!-- The embed component created in embed.ts -->
        <afs-embed></afs-embed>
    <?php else: ?>
        <!-- The app component created in app.ts -->
        <afs-app class="">
          <div class="mdl-progress mdl-progress__indeterminate initial-loading is-upgraded">
            <div class="progressbar bar bar1" style="width: 0%;"></div>
            <div class="bufferbar bar bar2" style="width: 100%;"></div>
            <div class="auxbar bar bar3" style="width: 0%;"></div>
          </div>
          <div class="m-initial-loading-centred" style="width:100%; text-align:center; margin: auto;direction: ltr;">
            <div class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active is-upgraded" style="width: 64px;height: 64px;" data-upgraded=",MaterialSpinner">
              <div class="mdl-spinner__layer mdl-spinner__layer-1">
                <div class="mdl-spinner__circle-clipper mdl-spinner__left">
                  <div class="mdl-spinner__circle"></div>
                </div><div class="mdl-spinner__gap-patch"><div class="mdl-spinner__circle"></div></div><div class="mdl-spinner__circle-clipper mdl-spinner__right"><div class="mdl-spinner__circle"></div></div>
              </div>
              <div class="mdl-spinner__layer mdl-spinner__layer-2">
                <div class="mdl-spinner__circle-clipper mdl-spinner__left">
                  <div class="mdl-spinner__circle"></div>
                </div><div class="mdl-spinner__gap-patch"><div class="mdl-spinner__circle"></div></div><div class="mdl-spinner__circle-clipper mdl-spinner__right"><div class="mdl-spinner__circle"></div></div>
              </div>
              <div class="mdl-spinner__layer mdl-spinner__layer-3">
                <div class="mdl-spinner__circle-clipper mdl-spinner__left">
                  <div class="mdl-spinner__circle"></div>
                </div><div class="mdl-spinner__gap-patch"><div class="mdl-spinner__circle"></div></div><div class="mdl-spinner__circle-clipper mdl-spinner__right"><div class="mdl-spinner__circle"></div></div>
              </div>
              <div class="mdl-spinner__layer mdl-spinner__layer-4">
                <div class="mdl-spinner__circle-clipper mdl-spinner__left">
                  <div class="mdl-spinner__circle"></div>
                </div><div class="mdl-spinner__gap-patch"><div class="mdl-spinner__circle"></div></div><div class="mdl-spinner__circle-clipper mdl-spinner__right"><div class="mdl-spinner__circle"></div></div>
              </div>
            </div>
          </div>
        </afs-app>
    <?php endif; ?>
      <script>
      // Fixes undefined module function in SystemJS bundle
      function module() {}
      </script>
    <!-- shims:js -->
    <!-- endinject -->
    <!-- libs:js -->
    <!-- endinject -->
    <script type="text/javascript" src="/js/loader.js"></script>
    <script>
      <?php
           //*
          //*****detect public user in front
          //*******niazy 
          //*******1396-08-09
          //**** 
		  $cat =new  Minds\Core\Categories\Repository();
          $minds = [
              "AfsContext" => __MINDS_CONTEXT__,
              "LoggedIn" => Minds\Core\Session::isLoggedIn() ? true : false,
              "Admin" => Minds\Core\Session::isAdmin() ? true : false,
              "Public" => Minds\Core\Session::isPublic() ? true : false,
              "cdn_url" => Minds\Core\Config::_()->get('cdn_url') ?: Minds\Core\Config::_()->cdn_url,
              "site_url" => Minds\Core\Config::_()->get('site_url') ?: Minds\Core\Config::_()->site_url,
              "socket_server" => Minds\Core\Config::_()->get('sockets-server-uri') ?: '192.168.164.130:3030',
              "navigation" => Minds\Core\Navigation\Manager::export(),
              "thirdpartynetworks" => Minds\Core\Di\Di::_()->get('ThirdPartyNetworks\Manager')->availableNetworks(),
              'language' => $language,
              "categories" => $cat->getCategoryFromDB() ?: [],
              //"stripe_key" => Minds\Core\Config::_()->get('payments')['stripe']['public_key'],
              "recaptchaKey" => Minds\Core\Config::_()->get('google')['recaptcha']['site_key'],
              "max_video_length" => Minds\Core\Config::_()->get('max_video_length')
          ];
          if(Minds\Core\Session::isLoggedIn()){
              $minds['user'] = Minds\Core\Session::getLoggedinUser()->export();
              $minds['wallet'] = array('balance' => Minds\Helpers\Counters::get(Minds\Core\Session::getLoggedinUser()->guid, 'points', false));
          }

          if (__MINDS_CONTEXT__ === 'embed') {
              $minds['MindsEmbed'] = $embedded_entity;
          }
      ?>
      window.Afs = <?= json_encode($minds) ?>;
    </script>
	
    <% if (ENV !== 'prod') { %>
    <!-- inject:js -->
  	<!-- endinject -->
    <% } else { %>
    <script src="/js/shims.js?v=<%= VERSION %>"></script>
   
    <% } %>
    <script type="text/javascript" src="/js/app.js"></script>
    <% if (ENV === 'dev') { %>
    <script>
      System.import('<%= BOOTSTRAP_MODULE %>')
        .catch(function(){console.error(e,'Report this error at https://192.168.164.130')});
    </script>
    <% } %>
  </body>
</html>
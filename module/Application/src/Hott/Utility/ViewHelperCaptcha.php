<?php
//module\Application\src\Application\View\Helper\Form\Custom\Captcha\ViewHelperCaptcha.php
namespace Hott\Utility;
 
// use Zend\Form\View\Helper\Captcha\AbstractWord;
 
// use Application\View\Helper\Form\Custom\Captcha\CustomCaptcha as CaptchaAdapter;
// use Zend\Form\ElementInterface;
// use Zend\Form\Exception;
 
// class ViewHelperCaptcha extends AbstractWord
// {
//  /**
//   * Override
//   * 
//   * Render the captcha
//   *
//   * @param  ElementInterface $element
//   * @throws Exception\DomainException
//   * @return string
//   */
//  public function render(ElementInterface $element)
//  {
//   //we could also set the separator here to break between the inputs and the image.
//   //$this->setSeparator('')
//   $captcha = $element->getCaptcha();
  
//   if ($captcha === null || !$captcha instanceof CaptchaAdapter) {
//    throw new Exception\DomainException(sprintf(
//      '%s requires that the element has a "captcha" attribute of type Zend\Captcha\Image; none found',
//      __METHOD__
//    ));
//   }
  
//   $captcha->generate();
  
//   $imgAttributes = array(
//     'width'  => $captcha->getWidth(),
//     'height' => $captcha->getHeight(),
//     'alt'    => $captcha->getImgAlt(),
//     'src'    => $captcha->getImgUrl() . $captcha->getId() . $captcha->getSuffix(),
//   );
//   $closingBracket = $this->getInlineClosingBracket();
//   $img = sprintf(
//     '<img %s%s',
//     $this->createAttributesString($imgAttributes),
//     $closingBracket
//   );
  
//   $position     = $this->getCaptchaPosition();
//   $separator    = $this->getSeparator();
//   $captchaInput = $this->renderCaptchaInputs($element);
  
//   $pattern = '<div class="captcha_image">
// %s</div>
// %s<div class="captcha_input">
// %s</div>
// '
//   if ($position == self::CAPTCHA_PREPEND) {
//    return sprintf($pattern, $captchaInput, $separator, $img);
//   }
  
//   return sprintf($pattern, $img, $separator, $captchaInput);
//  }
  
// }
//    